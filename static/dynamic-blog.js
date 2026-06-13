(() => {
    const feedContainer = document.querySelector("[data-blog-feed]");

    if (!feedContainer) {
        return;
    }

    const feedUrl = feedContainer.dataset.blogFeed;
    const blogUrl = "https://commithistory.blogspot.com";
    const callbackName = `renderCommitHistoryFeed_${Date.now()}`;

    const fallbackPosts = [
        {
            title: "Build Notes, Devlogs, and Reflections",
            url: blogUrl,
            published: "Live Blog",
            summary: "Read the latest Commit History posts about product decisions, debugging, portfolio updates, and what I am learning while building."
        },
        {
            title: "Personal OS Progress",
            url: blogUrl,
            published: "Current Build",
            summary: "Follow the ongoing work behind Personal OS, including dashboard logic, energy-aware planning, shared spaces, and portfolio-ready polish."
        },
        {
            title: "Dillon Builds Updates",
            url: blogUrl,
            published: "Learning in Public",
            summary: "See how each project evolves from idea to implementation through concise posts focused on progress, problems, and next steps."
        }
    ];

    let hasRendered = false;

    function stripHtml(value = "") {
        const element = document.createElement("div");
        element.innerHTML = value;
        return element.textContent || element.innerText || "";
    }

    function truncate(value = "", limit = 155) {
        const cleaned = value.replace(/\s+/g, " ").trim();

        if (cleaned.length <= limit) {
            return cleaned;
        }

        return `${cleaned.slice(0, limit).trim()}…`;
    }

    function formatDate(value) {
        if (!value || value === "Live Blog" || value === "Current Build" || value === "Learning in Public") {
            return value || "Recent Post";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Recent Post";
        }

        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(date);
    }

    function getPostUrl(entry) {
        const links = entry.link || [];
        const alternate = links.find((link) => link.rel === "alternate");

        return alternate?.href || blogUrl;
    }

    function normalizePosts(data) {
        const entries = data?.feed?.entry || [];

        return entries.slice(0, 3).map((entry) => ({
            title: entry.title?.$t || "Untitled Commit History Post",
            url: getPostUrl(entry),
            published: entry.published?.$t || entry.updated?.$t,
            summary: stripHtml(entry.summary?.$t || entry.content?.$t || "Read the full update on Commit History.")
        }));
    }

    function renderPosts(posts, isFallback = false) {
        hasRendered = true;

        const cards = posts.map((post) => {
            const safeTitle = post.title;
            const safeSummary = truncate(post.summary);
            const safeDate = formatDate(post.published);

            return `
                <article class="blog-post-card${isFallback ? " blog-post-card-fallback" : ""}">
                    <p class="blog-post-meta">${safeDate}</p>
                    <h3>${safeTitle}</h3>
                    <p>${safeSummary}</p>
                    <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="blog-post-link">Read post →</a>
                </article>
            `;
        }).join("");

        feedContainer.innerHTML = cards;
        feedContainer.classList.toggle("using-fallback", isFallback);
    }

    function renderFallback() {
        if (hasRendered) {
            return;
        }

        renderPosts(fallbackPosts, true);
    }

    window[callbackName] = (data) => {
        const posts = normalizePosts(data);

        if (!posts.length) {
            renderFallback();
            return;
        }

        renderPosts(posts);
    };

    const script = document.createElement("script");
    const separator = feedUrl.includes("?") ? "&" : "?";
    script.src = `${feedUrl}${separator}callback=${callbackName}`;
    script.async = true;
    script.onerror = renderFallback;

    document.body.appendChild(script);

    window.setTimeout(renderFallback, 4500);
})();
