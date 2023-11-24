FROM denoland/deno:1.38.3
WORKDIR /workspace
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*