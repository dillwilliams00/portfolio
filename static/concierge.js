(() => {
    const adapter = window.DillonBuildsProjectInquiry;
    if (!adapter) return;

    const storageKey = "db_concierge_workspace_v1";
    const blankPacketUrl = "/assets/dillon-builds-website-services-project-quote-guide.pdf";
    const packages = [
        { id: "starter", name: "Starter Website", price: "$250–$300", maxPages: 3 },
        { id: "business", name: "Business Website", price: "Starting at $400", maxPages: 5 },
        { id: "expanded", name: "Expanded Website", price: "Starting at $600", maxPages: 8 },
    ];
    const addOns = [
        "Additional page",
        "Copy cleanup or light rewriting",
        "Full website copywriting",
        "Logo cleanup or simple brand mark",
        "Custom contact or quote form",
        "Photo gallery or portfolio section",
        "Blog or resource section setup",
        "Basic analytics setup",
        "Domain connection and launch support",
        "Monthly maintenance",
        "Priority turnaround",
    ];

    const steps = [
        { id: "contact_name", label: "First, what's your name?", type: "text", section: "Basics" },
        { id: "business_name", label: "What's the name of your business or project?", type: "text", section: "Basics" },
        { id: "project_type", label: "What kind of website are you looking to build?", type: "single", section: "Basics", options: ["Portfolio or personal site", "Business website", "Landing page", "Website redesign or refresh", "Blog or resource site", "E-commerce or online store", "Not sure yet"] },
        { id: "current_website", label: "Do you have a current website? If so, paste the URL.", type: "text", section: "Basics", optional: true },
        { id: "project_description", label: "Describe your project in a sentence or two.", type: "textarea", section: "Basics" },
        { id: "website_goals", label: "What's the main thing you want this website to accomplish?", type: "single", section: "Goals", options: ["Get more clients or customers", "Show my work or portfolio", "Explain what I do", "Get hired", "Build an audience", "Sell products or services", "Look more professional", "Other"] },
        { id: "target_audience", label: "Who is the main audience for this site?", type: "single", section: "Goals", options: ["Employers or recruiters", "Local customers", "Online customers", "Industry professionals", "Existing clients", "General public", "Not sure yet"] },
        { id: "desired_actions", label: "What should visitors do when they reach the site?", type: "multi", section: "Goals", options: ["Contact me", "Book a call or appointment", "Buy something", "Download something", "Sign up for a list", "View my work", "Learn about my services", "Get directions or hours"] },
        { id: "requested_pages", label: "Which pages or sections do you think you'll need?", type: "multi", section: "Scope", options: ["Home", "About", "Services", "Portfolio or Work", "Pricing", "Contact", "FAQ", "Gallery", "Blog or Resources", "Testimonials", "Team", "Other"] },
        { id: "requested_features", label: "Do you need any of these features?", type: "multi", section: "Scope", options: ["Contact form", "Booking or scheduling", "Photo gallery", "Video embedding", "Blog or news feed", "Email signup", "E-commerce / online store", "Client login or members area", "Custom quote form", "None of these"] },
        { id: "integrations", label: "Any tools or platforms the site needs to connect with?", type: "multi", section: "Scope", options: ["Google Analytics", "Mailchimp or email marketing", "Stripe or payment processor", "Calendly or booking tool", "Social media feeds", "None that I know of"] },
        { id: "package_interest", label: "Do you have a package in mind?", type: "single", section: "Scope", options: ["Starter Website ($250–$300)", "Business Website (starting at $400)", "Expanded Website (starting at $600)", "Not sure — give me a recommendation"] },
        { id: "design_direction", label: "How should the site feel visually?", type: "single", section: "Design", options: ["Clean and professional", "Minimal and modern", "Warm and personal", "Bold and creative", "Local business friendly", "Playful and fun", "Not sure yet"] },
        { id: "branding_status", label: "What's your current branding situation?", type: "single", section: "Design", options: ["I have a full brand guide", "I have a logo and colors", "I have a logo only", "I have colors but no logo", "I have nothing yet", "I need help with branding"] },
        { id: "content_readiness", label: "What content do you already have ready?", type: "single", section: "Content", options: ["Yes, I have most of it", "I have some, need to fill in gaps", "Starting from scratch", "I'd like help writing it"] },
        { id: "timeline", label: "When would you ideally want the site ready?", type: "single", section: "Logistics", options: ["ASAP", "Within 2 weeks", "Within a month", "Within 2–3 months", "Flexible"] },
        { id: "budget", label: "Do you have a rough budget in mind?", type: "single", section: "Logistics", options: ["Under $300", "$300–$500", "$500–$800", "$800+", "Not sure yet"] },
        { id: "contact_email", label: "What's the best email address for Dillon to reach you?", type: "email", section: "Logistics" },
        { id: "additional_notes", label: "Anything else you'd like Dillon to know?", type: "textarea", section: "Logistics", optional: true },
    ];

    const state = loadState();

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "{}");
        } catch {
            return {};
        }
    }

    function saveState() {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ ...state, files: [] }));
        } catch {
            // Non-critical: the widget can continue without persistence.
        }
    }

    state.stepIndex ??= 0;
    state.answers ??= {};
    state.files ??= [];
    state.view ??= "welcome";

    const root = document.createElement("div");
    root.className = "db-concierge";
    root.innerHTML = `
        <button class="db-concierge-launcher" type="button" aria-label="Open Dillon Builds Project Assistant" aria-expanded="false">
            <span aria-hidden="true">💬</span>
            <span class="db-concierge-progress" hidden></span>
        </button>
        <section class="db-concierge-panel" role="dialog" aria-modal="false" aria-labelledby="db-concierge-title" hidden>
            <header class="db-concierge-header">
                <div class="db-concierge-badge">DB</div>
                <div>
                    <h2 id="db-concierge-title">Dillon Builds Project Assistant</h2>
                    <p>Plan your project · Ask a question</p>
                </div>
                <button type="button" class="db-concierge-close" aria-label="Close project assistant">×</button>
            </header>
            <nav class="db-concierge-tabs" aria-label="Project assistant views">
                <button type="button" data-view="chat" class="active">Chat</button>
                <button type="button" data-view="project">My Project</button>
            </nav>
            <div class="db-concierge-body" data-concierge-body></div>
        </section>
    `;
    document.body.append(root);

    const launcher = root.querySelector(".db-concierge-launcher");
    const panel = root.querySelector(".db-concierge-panel");
    const closeButton = root.querySelector(".db-concierge-close");
    const body = root.querySelector("[data-concierge-body]");

    launcher.addEventListener("click", () => {
        const isOpen = panel.hidden;
        panel.hidden = !isOpen;
        launcher.setAttribute("aria-expanded", String(isOpen));
        launcher.querySelector("span").textContent = isOpen ? "×" : "💬";
        render();
    });

    closeButton.addEventListener("click", closePanel);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) closePanel();
    });

    root.querySelectorAll("[data-view]").forEach((button) => {
        button.addEventListener("click", () => {
            state.view = button.dataset.view;
            render();
        });
    });

    function closePanel() {
        panel.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
        launcher.querySelector("span").textContent = "💬";
    }

    function setView(view) {
        state.view = view;
        render();
    }

    function currentStep() {
        return steps[state.stepIndex] || null;
    }

    function completionPercent() {
        const required = steps.filter((step) => !step.optional).length;
        const filled = steps.filter((step) => !step.optional && state.answers[step.id]).length;
        return Math.round((filled / required) * 100);
    }

    function render() {
        root.querySelector(".db-concierge-progress").hidden = !Object.keys(state.answers).length;
        root.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));

        if (state.view === "project") renderProject();
        else renderChat();
        saveState();
    }

    function renderChat() {
        if (state.viewState === "review") return renderReview();
        if (state.viewState === "uploads") return renderUploads();
        if (state.viewState === "done") return renderDone();
        if (state.viewState === "recommendation") return renderRecommendation();

        if (state.view === "welcome" || state.stepIndex === 0 && !Object.keys(state.answers).length) {
            body.innerHTML = `
                <div class="db-concierge-message bot">
                    <strong>Hi, I’m the Dillon Builds Project Assistant.</strong>
                    <p>I can help you plan a website, recommend a service package, prepare your Welcome Packet, and send a project request to Dillon.</p>
                </div>
                <div class="db-concierge-actions">
                    <button type="button" data-start-planning>Plan my project</button>
                    <button type="button" data-download-blank>Download blank Welcome Packet</button>
                </div>
            `;
            body.querySelector("[data-start-planning]").addEventListener("click", () => {
                state.view = "chat";
                state.viewState = "planning";
                render();
            });
            body.querySelector("[data-download-blank]").addEventListener("click", downloadBlankPacket);
            return;
        }

        const step = currentStep();
        if (!step) {
            state.viewState = "recommendation";
            render();
            return;
        }

        body.innerHTML = `
            <div class="db-concierge-progress-bar"><span style="width:${completionPercent()}%"></span></div>
            <p class="db-concierge-section">${step.section}</p>
            <div class="db-concierge-message bot"><p>${escapeHtml(step.label)}</p></div>
            <form class="db-concierge-step-form"></form>
        `;

        const form = body.querySelector("form");
        renderStepInput(form, step);
        form.insertAdjacentHTML("beforeend", `
            <div class="db-concierge-step-actions">
                ${step.optional ? '<button type="button" data-skip>Skip</button>' : ""}
                <button type="submit">Continue</button>
            </div>
        `);

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const value = readStepValue(form, step);
            if (!step.optional && (!value || Array.isArray(value) && !value.length)) return;
            state.answers[step.id] = value;
            state.stepIndex += 1;
            render();
        });

        form.querySelector("[data-skip]")?.addEventListener("click", () => {
            state.stepIndex += 1;
            render();
        });
    }

    function renderStepInput(form, step) {
        if (step.type === "single" || step.type === "multi") {
            const type = step.type === "multi" ? "checkbox" : "radio";
            form.insertAdjacentHTML("beforeend", `
                <div class="db-concierge-options">
                    ${step.options.map((option) => `
                        <label>
                            <input type="${type}" name="step_value" value="${escapeHtml(option)}">
                            <span>${escapeHtml(option)}</span>
                        </label>
                    `).join("")}
                </div>
            `);
            return;
        }

        if (step.type === "textarea") {
            form.insertAdjacentHTML("beforeend", `<textarea name="step_value" rows="4"></textarea>`);
            return;
        }

        form.insertAdjacentHTML("beforeend", `<input name="step_value" type="${step.type === "email" ? "email" : "text"}">`);
    }

    function readStepValue(form, step) {
        if (step.type === "multi") {
            return [...form.querySelectorAll("[name='step_value']:checked")].map((input) => input.value).filter((value) => !value.startsWith("None"));
        }

        if (step.type === "single") {
            return form.querySelector("[name='step_value']:checked")?.value || "";
        }

        return form.querySelector("[name='step_value']")?.value.trim() || "";
    }

    function renderRecommendation() {
        const recommendation = getRecommendation();
        body.innerHTML = `
            <div class="db-concierge-message bot">
                <strong>Recommended package</strong>
                <h3>${recommendation.name}</h3>
                <p>${recommendation.price}</p>
                <p>${recommendation.reason}</p>
            </div>
            <div class="db-concierge-actions">
                <button type="button" data-uploads>Add files</button>
                <button type="button" data-review>Review project</button>
                <button type="button" data-packet>Download filled packet</button>
            </div>
        `;
        body.querySelector("[data-uploads]").addEventListener("click", () => { state.viewState = "uploads"; render(); });
        body.querySelector("[data-review]").addEventListener("click", () => { state.viewState = "review"; render(); });
        body.querySelector("[data-packet]").addEventListener("click", downloadFilledPacket);
    }

    function renderUploads() {
        body.innerHTML = `
            <div class="db-concierge-message bot">
                <strong>Upload project files</strong>
                <p>You can add logos, photos, written content, sketches, inspiration, PDFs, DOCX, or TXT files. Up to 20 files, 20 MB each.</p>
            </div>
            <input class="db-concierge-file-input" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.docx,.txt,image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain">
            <div class="db-concierge-file-list">${renderFileList()}</div>
            <div class="db-concierge-actions">
                <button type="button" data-review>Review project</button>
                <button type="button" data-back>Back</button>
            </div>
        `;
        body.querySelector("input[type='file']").addEventListener("change", (event) => {
            const files = [...event.target.files];
            const error = validateFiles(files);
            if (error) {
                alert(error);
                event.target.value = "";
                return;
            }
            state.files = files;
            renderUploads();
        });
        body.querySelector("[data-review]").addEventListener("click", () => { state.viewState = "review"; render(); });
        body.querySelector("[data-back]").addEventListener("click", () => { state.viewState = "recommendation"; render(); });
    }

    function renderReview() {
        const inquiry = buildConciergeInquiry();
        body.innerHTML = `
            <div class="db-concierge-review">
                <h3>Review your project</h3>
                <p>Downloading the packet does not submit anything. Use Submit to send your project request to Dillon.</p>
                <dl>
                    <dt>Name</dt><dd>${escapeHtml(inquiry.contact_name || "Not provided")}</dd>
                    <dt>Email</dt><dd>${escapeHtml(inquiry.contact_email || "Not provided")}</dd>
                    <dt>Business</dt><dd>${escapeHtml(inquiry.business_name || "Not provided")}</dd>
                    <dt>Package</dt><dd>${escapeHtml(inquiry.package_interest || "Not sure")}</dd>
                    <dt>Timeline</dt><dd>${escapeHtml(inquiry.timeline || "Not provided")}</dd>
                    <dt>Files</dt><dd>${state.files.length ? `${state.files.length} selected` : "None selected"}</dd>
                </dl>
                <p class="db-concierge-error" hidden></p>
            </div>
            <div class="db-concierge-actions">
                <button type="button" data-packet>Download filled packet</button>
                <button type="button" data-submit>Submit to Dillon</button>
                <button type="button" data-edit>Edit answers</button>
            </div>
        `;
        body.querySelector("[data-packet]").addEventListener("click", downloadFilledPacket);
        body.querySelector("[data-edit]").addEventListener("click", () => { state.viewState = "planning"; render(); });
        body.querySelector("[data-submit]").addEventListener("click", submitConcierge);
    }

    function renderDone() {
        body.innerHTML = `
            <div class="db-concierge-message bot">
                <strong>Project brief sent.</strong>
                <p>Your project request was submitted to Dillon Builds. You can download the filled packet for your records.</p>
            </div>
            <div class="db-concierge-actions">
                <button type="button" data-packet>Download filled packet</button>
                <button type="button" data-close>Close</button>
            </div>
        `;
        body.querySelector("[data-packet]").addEventListener("click", downloadFilledPacket);
        body.querySelector("[data-close]").addEventListener("click", closePanel);
    }

    function renderProject() {
        body.innerHTML = `
            <div class="db-concierge-dashboard">
                <h3>My Project</h3>
                <div class="db-concierge-progress-ring">${completionPercent()}%</div>
                <p>${Object.keys(state.answers).length ? "Your project brief is in progress." : "No project details yet."}</p>
                <div class="db-concierge-actions">
                    <button type="button" data-chat>Continue planning</button>
                    <button type="button" data-review>Review project</button>
                    <button type="button" data-reset>Start over</button>
                </div>
            </div>
        `;
        body.querySelector("[data-chat]").addEventListener("click", () => setView("chat"));
        body.querySelector("[data-review]").addEventListener("click", () => { state.view = "chat"; state.viewState = "review"; render(); });
        body.querySelector("[data-reset]").addEventListener("click", () => {
            if (!confirm("Start over and clear this project brief?")) return;
            state.answers = {};
            state.files = [];
            state.stepIndex = 0;
            state.view = "chat";
            state.viewState = "welcome";
            saveState();
            render();
        });
    }

    function getRecommendation() {
        const pages = arrayFrom(state.answers.requested_pages);
        const features = arrayFrom(state.answers.requested_features);
        const advanced = features.some((feature) => /e-commerce|booking|client login|custom quote/i.test(feature));
        let selected = packages[1];
        let reason = "Based on what you described, this is the most practical starting point.";

        if (advanced || pages.length > 5) {
            selected = packages[2];
            reason = "Your project appears to need a larger scope or advanced features, so Expanded Website is the best starting point.";
        } else if (pages.length && pages.length <= 3) {
            selected = packages[0];
            reason = "For a focused site with up to 3 pages, Starter Website is a strong fit.";
        }

        if (state.answers.package_interest && !String(state.answers.package_interest).startsWith("Not sure")) {
            const explicit = packages.find((item) => state.answers.package_interest.includes(item.name));
            if (explicit) {
                selected = explicit;
                reason = "You selected this package during planning. Dillon will confirm the final scope after review.";
            }
        }

        return { ...selected, reason };
    }

    function buildConciergeInquiry() {
        const answers = state.answers;
        const recommended = getRecommendation();
        const requestedServices = [
            answers.package_interest || `${recommended.name} (${recommended.price})`,
            ...addOns.filter((addOn) => arrayFrom(answers.requested_features).includes(addOn)),
        ];

        return {
            submission_source: "project_concierge",
            contact_name: answers.contact_name || "",
            contact_email: answers.contact_email || "",
            contact_phone: "",
            preferred_contact_method: "Email",
            business_name: answers.business_name || "",
            business_location: "",
            current_website: answers.current_website || "",
            project_name: answers.business_name || "",
            project_type: answers.project_type || "",
            project_description: answers.project_description || "",
            website_goals: answers.website_goals || "",
            target_audience: answers.target_audience || "",
            desired_actions: joinReadable(answers.desired_actions),
            requested_services: joinReadable(requestedServices),
            package_interest: answers.package_interest || `${recommended.name} (${recommended.price})`,
            pages_needed: joinReadable(answers.requested_pages),
            requested_pages: joinReadable(answers.requested_pages),
            requested_features: joinReadable(answers.requested_features),
            integrations: joinReadable(answers.integrations),
            design_direction: answers.design_direction || "",
            branding_status: answers.branding_status || "",
            content_readiness: answers.content_readiness || "",
            timeline: answers.timeline || "",
            budget: answers.budget || "",
            questions_for_dillon: "",
            additional_notes: answers.additional_notes || "",
            welcome_packet_status: "filled_packet_available_in_browser",
        };
    }

    function conciergePacketAnswers() {
        const inquiry = buildConciergeInquiry();
        return {
            Name: inquiry.contact_name,
            Email: inquiry.contact_email,
            "Business Name": inquiry.business_name,
            "Business Location": inquiry.business_location,
            "Package Interest": inquiry.package_interest,
            "Ideal Timeline": inquiry.timeline,
            "Current Website": inquiry.current_website,
            "Website Goals": inquiry.website_goals || inquiry.project_description,
            "Pages Needed": inquiry.requested_pages,
            "Add-ons": inquiry.requested_features ? inquiry.requested_features.split(", ").filter(Boolean) : [],
            "Existing Content": inquiry.content_readiness,
            "Additional Details": [inquiry.design_direction, inquiry.branding_status, inquiry.additional_notes].filter(Boolean).join("\n"),
        };
    }

    async function submitConcierge(event) {
        const button = event.currentTarget;
        const error = body.querySelector(".db-concierge-error");
        button.disabled = true;
        button.textContent = "Submitting...";
        if (error) error.hidden = true;

        const result = await adapter.submitProjectInquiry(buildConciergeInquiry(), state.files);

        if (result.ok) {
            adapter.setPacketAnswers(conciergePacketAnswers());
            state.viewState = "done";
            state.submittedAt = new Date().toISOString();
            render();
            return;
        }

        if (error) {
            error.textContent = result.error;
            error.hidden = false;
        } else {
            alert(result.error);
        }
        button.disabled = false;
        button.textContent = "Submit to Dillon";
    }

    function downloadFilledPacket() {
        const packetHtml = adapter.buildFilledPacketHtml(conciergePacketAnswers());
        adapter.downloadTextFile("dillon-builds-filled-welcome-packet.html", packetHtml);
    }

    function downloadBlankPacket() {
        const link = document.createElement("a");
        link.href = blankPacketUrl;
        link.download = "dillon-builds-welcome-packet.pdf";
        document.body.append(link);
        link.click();
        link.remove();
    }

    function renderFileList() {
        if (!state.files.length) return '<p class="muted">No files selected yet.</p>';
        return `<ul>${state.files.map((file) => `<li>${escapeHtml(file.name)} <span>${formatBytes(file.size)}</span></li>`).join("")}</ul>`;
    }

    function validateFiles(files) {
        if (files.length > adapter.fileLimits.maxFiles) return `Please upload no more than ${adapter.fileLimits.maxFiles} files.`;
        const total = files.reduce((sum, file) => sum + file.size, 0);
        if (total > adapter.fileLimits.maxTotalBytes) return `The total upload limit is ${formatBytes(adapter.fileLimits.maxTotalBytes)}.`;
        for (const file of files) {
            const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
            if (!adapter.fileLimits.allowedExtensions.includes(ext)) return `${file.name} is not a supported file type.`;
            if (file.size > adapter.fileLimits.maxFileSizeBytes) return `${file.name} is too large.`;
        }
        return "";
    }

    render();
})();
