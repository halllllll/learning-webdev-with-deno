updateTimeLine();

async function updateTimeLine() {
    const response = await fetch("/messages");
    const messages = await response.json();

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
            console.log("あれ？データは...？")

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
        }
    })