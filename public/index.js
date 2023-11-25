updateTimeLine();

async function updateTimeLine() {
    const response = await fetch("/messages");
    const messages = await response.json();

    const timeLineHtml = document.querySelector(".timeline");

    // すでに中身があったら削除
    while (timeLineHtml.firstChild) {
        timeLineHtml.removeChild(timeLineHtml.firstChild)
    }

    const contentTemplate = document.getElementById("content-template");

    messages.forEach((message) => {
        const content = createContent(message);
        timeLineHtml.appendChild(content);
    })

    function createContent(message) {
        // テンプレートを複製
        const contentObject = contentTemplate.content.cloneNode(true);
        const content = contentObject.querySelector(".content");

        content.id = message.id;
        content.querySelector(".author").innerText = message.author;
        content.querySelector(".id").innerText = message.id;
        content.querySelector(".message").innerText = message.message;
        content.querySelector(".nice-count").innerText = message.nice_count;

        content.querySelector(".nice").addEventListener("click", {
            content: content,
            handleEvent: async function () {
                const id = this.content.querySelector(".id").innerText;
                const incrementNiceCount = Number(this.content.querySelector(".nice-count").innerText) + 1;
                await fetch(`/messages/${id}/nice`, {
                    method: "PUT",
                    body: JSON.stringify({
                        nice_count: incrementNiceCount
                    }),
                });

                updateTimeLine();

            }
        });

        content.querySelector(".delete").addEventListener("click", {
            content: content,
            handleEvent: async function () {
                const id = this.content.querySelector(".id").innerText;
                await fetch(`/messages/${id}`, {
                    method: "DELETE"
                });

                updateTimeLine();
            }
        })


        return content;
    }

    console.log("画面読み込み時は全部データを取得する")
    console.log(messages);
}

document.getElementById("post-form")
    .addEventListener("submit", async (event) => {
        try {
            event.preventDefault();
            event.stopPropagation();

            const author = document.getElementById("post-author").value;
            const message = document.getElementById("post-message").value;

            if (author === "" || message === "") {
                alert("データが空だとだめだよ〜")
                return;
            }

            await fetch("/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author,
                    message
                })
            });
            document.getElementById("post-form").reset();

        } catch (err) {
            console.error(err)
        } finally {
            updateTimeLine();
        }
    });


