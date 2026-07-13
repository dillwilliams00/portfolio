const menuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");
const dropdownParents = document.querySelectorAll(".nav-dropdown > a");
const projectSearch = document.querySelector("#projectSearch");
const projectCards = document.querySelectorAll("[data-project-card]");
const searchEmpty = document.querySelector(".search-empty");
const quoteForm = document.querySelector("[data-project-inquiry-form]");
const filledPacketButton = document.querySelector("[data-download-filled-packet]");
const packetStatus = document.querySelector("[data-packet-status]");
const packetStorageKey = "dillonBuildsQuotePacketAnswers";
const canonicalFormName = "quote-request";
const projectFileLimits = {
    maxFiles: 20,
    maxFileSizeBytes: 20 * 1024 * 1024,
    maxTotalBytes: 100 * 1024 * 1024,
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf", ".docx", ".txt"],
};

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "×" : "☰";
    });
}

dropdownParents.forEach((dropdownLink) => {
    dropdownLink.addEventListener("click", (event) => {
        const isMobile = window.matchMedia("(max-width: 650px)").matches;
        if (!isMobile) return;
        event.preventDefault();
        const parentDropdown = dropdownLink.closest(".nav-dropdown");
        parentDropdown?.classList.toggle("submenu-open");
    });
});

if (projectSearch && projectCards.length > 0) {
    projectSearch.addEventListener("input", () => {
        const searchTerm = projectSearch.value.toLowerCase().trim();
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const cardText = card.textContent.toLowerCase();
            const matchesSearch = cardText.includes(searchTerm);
            card.hidden = !matchesSearch;
            if (matchesSearch) visibleCount += 1;
        });

        if (searchEmpty) {
            searchEmpty.hidden = visibleCount !== 0;
        }
    });
}

function getPacketAnswers() {
    try {
        return JSON.parse(sessionStorage.getItem(packetStorageKey) || "{}");
    } catch {
        return {};
    }
}

function setPacketAnswers(answers) {
    try {
        sessionStorage.setItem(packetStorageKey, JSON.stringify(answers));
    } catch {
        // The form still submits normally if local storage is unavailable.
    }
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatAnswer(value) {
    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : "";
    }

    return value || "";
}

function answerBlock(label, value) {
    const formatted = formatAnswer(value);
    return `
        <section class="answer-block">
            <h3>${escapeHtml(label)}</h3>
            <div class="answer-line">${formatted ? escapeHtml(formatted) : "&nbsp;"}</div>
        </section>
    `;
}

function checkboxList(items = []) {
    if (!items.length) {
        return '<p class="muted">No add-ons selected.</p>';
    }

    return `<ul class="check-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function buildFilledPacketHtml(answers = {}) {
    const addOns = Array.isArray(answers["Add-ons"]) ? answers["Add-ons"] : [];
    const selectedOrBlank = (value) => escapeHtml(formatAnswer(value)) || "&nbsp;";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dillon Builds Filled Welcome Packet</title>
    <style>
        :root {
            --primary: #243447;
            --primary-dark: #172433;
            --accent: #2f80ed;
            --accent-soft: #eaf3ff;
            --text: #1f2933;
            --muted: #5f6b7a;
            --border: #d9e3f0;
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            background: #eef3f8;
            color: var(--text);
            font-family: "Segoe UI", Arial, sans-serif;
            line-height: 1.45;
        }

        .packet {
            display: grid;
            gap: 1.25rem;
            max-width: 8.5in;
            margin: 1.5rem auto;
        }

        .page {
            width: 8.5in;
            min-height: 11in;
            padding: 0.7in;
            background: #fff;
            box-shadow: 0 18px 45px rgba(31, 41, 51, 0.14);
            display: flex;
            flex-direction: column;
        }

        .page-footer {
            margin-top: auto;
            padding-top: 1rem;
            color: var(--muted);
            font-size: 0.8rem;
            text-align: center;
        }

        .cover-mark {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.35in;
            height: 2.35in;
            margin: 0.65in auto 0.9in;
            background: linear-gradient(135deg, var(--primary-dark), #0b1220);
            color: #fff;
            border-radius: 0.08in;
            font-size: 0.85in;
            font-weight: 900;
            letter-spacing: -0.08em;
        }

        .cover-title {
            margin: 0;
            color: #000;
            font-size: 0.72in;
            letter-spacing: -0.05em;
            line-height: 1.08;
            text-align: center;
        }

        .cover-subtitle {
            margin-top: 0.3in;
            color: var(--muted);
            text-align: center;
            font-size: 0.18in;
        }

        .section-title {
            margin: 0 0 0.24in;
            color: var(--primary);
            font-size: 0.36in;
            letter-spacing: -0.04em;
            line-height: 1.05;
        }

        .section-title.center {
            text-align: center;
            font-size: 0.52in;
        }

        .blue-heading {
            margin: 0.22in 0 0.08in;
            color: var(--accent);
            font-size: 0.28in;
            font-weight: 700;
        }

        p {
            margin: 0 0 0.16in;
        }

        .package-card,
        .answer-block,
        .note {
            border: 1px solid var(--border);
            border-radius: 0.12in;
            background: linear-gradient(180deg, #fff 0%, #f9fbff 100%);
            padding: 0.16in;
            margin-bottom: 0.16in;
        }

        .package-card h3,
        .answer-block h3 {
            margin: 0 0 0.06in;
            color: var(--primary);
            font-size: 0.15in;
        }

        .package-card strong {
            color: var(--accent);
            font-size: 0.18in;
        }

        .two-col,
        .three-col {
            display: grid;
            gap: 0.14in;
        }

        .two-col {
            grid-template-columns: repeat(2, 1fr);
        }

        .three-col {
            grid-template-columns: repeat(3, 1fr);
        }

        .answer-line {
            min-height: 0.4in;
            padding: 0.08in 0.1in;
            border-radius: 0.08in;
            background: var(--accent-soft);
            color: var(--primary);
            white-space: pre-wrap;
        }

        .answer-line.tall {
            min-height: 1.25in;
        }

        .muted {
            color: var(--muted);
        }

        ul {
            margin: 0.08in 0 0;
            padding-left: 0.22in;
        }

        .check-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.04in 0.16in;
            margin: 0;
            padding-left: 0.2in;
            color: var(--primary);
        }

        .process-item {
            margin-bottom: 0.18in;
        }

        @media print {
            @page { size: letter; margin: 0; }
            body { background: #fff; }
            .packet { display: block; margin: 0; max-width: none; }
            .page {
                box-shadow: none;
                break-after: page;
                page-break-after: always;
            }

            .page:last-child {
                break-after: auto;
                page-break-after: auto;
            }
        }

        @media (max-width: 720px) {
            .packet { margin: 0; }
            .page { width: 100%; min-height: auto; padding: 1.25rem; }
            .cover-title { font-size: 2.4rem; }
            .two-col, .three-col, .check-list { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <main class="packet">
        <section class="page">
            <div class="cover-mark">DB</div>
            <h1 class="cover-title">Website Services<br>&amp; Project Quote Guide</h1>
            <p class="cover-subtitle">Prepared by Dillon Builds with your submitted project details.</p>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h2 class="section-title">Welcome</h2>
            <p>A clear, professional website should make it easier for people to understand what you offer, trust your business, and take the next step.</p>
            <p>Dillon Builds creates practical, responsive websites without agency-sized pricing. Every project is shaped around the client's actual goals, budget, and timeline.</p>
            <h3 class="blue-heading">What you can expect:</h3>
            <ul>
                <li>Clear communication from start to finish</li>
                <li>Mobile-friendly design</li>
                <li>A focused plan before development begins</li>
                <li>Straightforward pricing with no surprise charges</li>
                <li>A site you can confidently share with customers</li>
            </ul>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h2 class="section-title center">Website Packages</h2>
            <article class="package-card">
                <h3>Starter Website</h3>
                <strong>$250–$300</strong>
                <p class="muted">Best for a new business, personal brand, event, or simple online presence.</p>
                <ul><li>Up to 3 core pages</li><li>Responsive mobile and desktop layout</li><li>Contact call-to-action</li><li>Basic contact form or inquiry link</li><li>Social media and business links</li><li>Basic search and sharing setup</li><li>One revision round</li></ul>
            </article>
            <article class="package-card">
                <h3>Business Website</h3>
                <strong>Starting at $400</strong>
                <p class="muted">Best for an established business that needs more room to explain services and build trust.</p>
                <ul><li>Up to 5 core pages</li><li>Service or product sections</li><li>Testimonials, FAQ, or gallery section</li><li>Contact form</li><li>Basic search and sharing setup</li><li>Two revision rounds</li></ul>
            </article>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <article class="package-card">
                <h3>Expanded Website</h3>
                <strong>Starting at $600</strong>
                <p class="muted">Best for a business that needs a larger or more customized site.</p>
                <ul><li>Up to 8 core pages</li><li>More advanced layouts and content structure</li><li>Multiple forms or calls-to-action</li><li>Blog, resource, portfolio, or project sections</li><li>Three revision rounds</li></ul>
            </article>
            <h2 class="section-title">Add-ons &amp; Optional Services</h2>
            <div class="two-col">
                <div>Additional page — $50 each</div>
                <div>Copy cleanup or light rewriting — Starting at $50</div>
                <div>Full website copywriting — Starting at $150</div>
                <div>Logo cleanup or simple brand mark — Starting at $75</div>
                <div>Custom contact or quote form — Starting at $50</div>
                <div>Photo gallery or portfolio section — Starting at $50</div>
                <div>Blog or resource section setup — Starting at $75</div>
                <div>Basic analytics setup — Starting at $50</div>
                <div>Domain connection and launch support — Starting at $50</div>
                <div>Monthly maintenance — Starting at $40 per month</div>
                <div>Priority turnaround — Quoted by project</div>
            </div>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h2 class="section-title center">What the Process Looks Like</h2>
            <div class="process-item"><h3 class="blue-heading">1. Project request</h3><p>You complete the quote form with your goals, preferred pages, budget, and timeline.</p></div>
            <div class="process-item"><h3 class="blue-heading">2. Discovery and recommendation</h3><p>I review the request and recommend the most practical package, features, and project scope.</p></div>
            <div class="process-item"><h3 class="blue-heading">3. Quote and agreement</h3><p>You receive a written quote outlining deliverables, timeline, included revisions, and payment terms.</p></div>
            <div class="process-item"><h3 class="blue-heading">4. Content collection</h3><p>You provide your logo, photos, business details, service descriptions, and any existing brand materials.</p></div>
            <div class="process-item"><h3 class="blue-heading">5. Design and development</h3><p>I build the website and share progress at agreed checkpoints.</p></div>
            <div class="process-item"><h3 class="blue-heading">6. Review and revisions</h3><p>You review the site and request changes included in your package.</p></div>
            <div class="process-item"><h3 class="blue-heading">7. Launch</h3><p>After final approval and payment, the website is connected to its domain and launched.</p></div>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h2 class="section-title">Project Quote Worksheet</h2>
            <p class="muted">Filled with the answers submitted through the website form.</p>
            <h3 class="blue-heading">Contact Information</h3>
            <div class="two-col">
                ${answerBlock("Your Name", answers.Name)}
                ${answerBlock("Email Address", answers.Email)}
                ${answerBlock("Business Name", answers["Business Name"])}
                ${answerBlock("Business Location", answers["Business Location"])}
                ${answerBlock("Current Website", answers["Current Website"])}
                ${answerBlock("Preferred Contact Method", "Email")}
            </div>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h3 class="blue-heading">Package Interest</h3>
            ${answerBlock("Selected Package", answers["Package Interest"])}
            <h3 class="blue-heading">Ideal Timeline</h3>
            ${answerBlock("Selected Timeline", answers["Ideal Timeline"])}
            <h3 class="blue-heading">What do you need the website to accomplish?</h3>
            <div class="answer-line tall">${selectedOrBlank(answers["Website Goals"])}</div>
            <h3 class="blue-heading">Pages or Sections You May Need</h3>
            <div class="three-col">
                <div>Home</div><div>About</div><div>Services</div>
                <div>Contact</div><div>FAQ</div><div>Gallery or portfolio</div>
                <div>Testimonials</div><div>Blog or resources</div><div>Other</div>
            </div>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h3 class="blue-heading">What pages do you think you need? Add notes here.</h3>
            <div class="answer-line tall">${selectedOrBlank(answers["Pages Needed"])}</div>
            <h3 class="blue-heading">Optional Add-ons You May Need</h3>
            <section class="answer-block">${checkboxList(addOns)}</section>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h3 class="blue-heading">What content do you already have?</h3>
            <div class="answer-line tall">${selectedOrBlank(answers["Existing Content"])}</div>
            <h3 class="blue-heading">Anything else I should know?</h3>
            <div class="answer-line tall">${selectedOrBlank(answers["Additional Details"])}</div>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>

        <section class="page">
            <h2 class="section-title">Full Project Brief</h2>
            <p class="muted">Additional planning details captured through the Project Assistant.</p>
            <div class="two-col">
                ${answerBlock("Project Type", answers["Project Type"])}
                ${answerBlock("Target Audience", answers["Target Audience"])}
                ${answerBlock("Desired Visitor Actions", answers["Desired Visitor Actions"])}
                ${answerBlock("Requested Features", answers["Requested Features"])}
                ${answerBlock("Integrations", answers.Integrations)}
                ${answerBlock("Design Direction", answers["Design Direction"])}
                ${answerBlock("Branding Status", answers["Branding Status"])}
                ${answerBlock("Budget", answers.Budget)}
            </div>
            <h2 class="section-title">Next Steps</h2>
            <p>I will review these details and recommend the most practical package, features, and project scope. You will receive a written quote outlining deliverables, timeline, included revisions, and payment terms.</p>
            <div class="note">Submitting this form begins the quote process and does not create a binding agreement. Final pricing, scope, payment terms, and timeline will be confirmed in writing before work begins.</div>
            <footer class="page-footer">Dillon Builds | dillonbuilds.dev | hello@dillonbuilds.dev</footer>
        </section>
    </main>
</body>
</html>`;
}

function downloadTextFile(filename, content, type = "text/html") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function arrayFrom(value) {
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function joinReadable(value) {
    return arrayFrom(value).join(", ");
}

function getFileExtension(filename = "") {
    const dotIndex = filename.lastIndexOf(".");
    return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateProjectFiles(files = []) {
    if (files.length > projectFileLimits.maxFiles) {
        return `Please upload no more than ${projectFileLimits.maxFiles} files.`;
    }

    let totalBytes = 0;

    for (const file of files) {
        const extension = getFileExtension(file.name);
        totalBytes += file.size;

        if (!projectFileLimits.allowedExtensions.includes(extension)) {
            return `${file.name} is not a supported file type. Please use JPG, PNG, WEBP, SVG, PDF, DOCX, or TXT.`;
        }

        if (file.size > projectFileLimits.maxFileSizeBytes) {
            return `${file.name} is too large. The maximum file size is ${formatBytes(projectFileLimits.maxFileSizeBytes)}.`;
        }
    }

    if (totalBytes > projectFileLimits.maxTotalBytes) {
        return `The selected files are too large together. The total upload limit is ${formatBytes(projectFileLimits.maxTotalBytes)}.`;
    }

    return "";
}

function buildAttachmentSummary(files = []) {
    if (!files.length) return "No files attached.";

    return files
        .map((file, index) => `${index + 1}. ${file.name} (${formatBytes(file.size)})`)
        .join("\n");
}

function buildProjectSummary(inquiry) {
    const lines = [
        "PROJECT INQUIRY — Dillon Builds",
        "================================",
        "",
        `Source: ${inquiry.submission_source || "unknown"}`,
        `Contact: ${inquiry.contact_name || ""}`,
        `Email: ${inquiry.contact_email || ""}`,
        `Business: ${inquiry.business_name || ""}`,
        "",
        "PROJECT",
        `Type: ${inquiry.project_type || ""}`,
        `Package interest: ${inquiry.package_interest || ""}`,
        `Description: ${inquiry.project_description || ""}`,
        `Current website: ${inquiry.current_website || ""}`,
        "",
        "GOALS AND SCOPE",
        `Goals: ${inquiry.website_goals || ""}`,
        `Audience: ${inquiry.target_audience || ""}`,
        `Desired actions: ${inquiry.desired_actions || ""}`,
        `Pages: ${inquiry.requested_pages || inquiry.pages_needed || ""}`,
        `Features: ${inquiry.requested_features || ""}`,
        `Add-ons/services: ${inquiry.requested_services || ""}`,
        "",
        "DESIGN, CONTENT, LOGISTICS",
        `Design direction: ${inquiry.design_direction || ""}`,
        `Branding status: ${inquiry.branding_status || ""}`,
        `Content readiness: ${inquiry.content_readiness || ""}`,
        `Timeline: ${inquiry.timeline || ""}`,
        `Budget: ${inquiry.budget || ""}`,
        "",
        "QUESTIONS / NOTES",
        inquiry.questions_for_dillon || "",
        inquiry.additional_notes || "",
    ];

    return lines.filter((line) => line !== undefined).join("\n");
}

function normalizePricingInquiry(form) {
    const formData = new FormData(form);
    const addOns = formData.getAll("Add-ons").map(String);

    return {
        submission_source: "pricing_form",
        contact_name: String(formData.get("Name") || ""),
        contact_email: String(formData.get("Email") || ""),
        contact_phone: "",
        preferred_contact_method: "Email",
        business_name: String(formData.get("Business Name") || ""),
        business_location: String(formData.get("Business Location") || ""),
        current_website: String(formData.get("Current Website") || ""),
        project_name: String(formData.get("Business Name") || ""),
        project_type: "Website project",
        project_description: String(formData.get("Website Goals") || ""),
        website_goals: String(formData.get("Website Goals") || ""),
        target_audience: "",
        desired_actions: "",
        requested_services: joinReadable(addOns),
        package_interest: String(formData.get("Package Interest") || ""),
        pages_needed: String(formData.get("Pages Needed") || ""),
        requested_pages: String(formData.get("Pages Needed") || ""),
        requested_features: joinReadable(addOns),
        integrations: "",
        design_direction: "",
        branding_status: "",
        content_readiness: String(formData.get("Existing Content") || ""),
        timeline: String(formData.get("Ideal Timeline") || ""),
        budget: "",
        questions_for_dillon: "",
        additional_notes: String(formData.get("Additional Details") || ""),
        welcome_packet_status: "filled_packet_available_after_submission",
    };
}

function pricingInquiryToPacketAnswers(inquiry) {
    return {
        Name: inquiry.contact_name,
        Email: inquiry.contact_email,
        "Business Name": inquiry.business_name,
        "Business Location": inquiry.business_location,
        "Package Interest": inquiry.package_interest,
        "Ideal Timeline": inquiry.timeline,
        "Current Website": inquiry.current_website,
        "Website Goals": inquiry.website_goals,
        "Pages Needed": inquiry.requested_pages,
        "Add-ons": inquiry.requested_services ? inquiry.requested_services.split(", ").filter(Boolean) : [],
        "Existing Content": inquiry.content_readiness,
        "Additional Details": inquiry.additional_notes,
    };
}

function appendInquiryFields(formData, inquiry, files = []) {
    const normalized = { ...inquiry };
    normalized.attachment_summary = buildAttachmentSummary(files);
    normalized.project_summary = buildProjectSummary(normalized);

    formData.append("form-name", canonicalFormName);
    Object.entries(normalized).forEach(([key, value]) => {
        formData.append(key, value || "");
    });

    files.forEach((file, index) => {
        formData.append(`project_file_${String(index + 1).padStart(2, "0")}`, file, file.name);
    });

    return normalized;
}

async function submitProjectInquiry(inquiry, files = []) {
    const fileError = validateProjectFiles(files);
    if (fileError) {
        return { ok: false, error: fileError };
    }

    if (!inquiry.contact_email) {
        return { ok: false, error: "Please include an email address so Dillon can reply." };
    }

    const formData = new FormData();
    const normalized = appendInquiryFields(formData, inquiry, files);

    try {
        const response = await fetch("/", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            return { ok: false, error: "The submission could not be sent. Please try again." };
        }

        return { ok: true, normalized };
    } catch {
        return { ok: false, error: "The submission could not be sent. Please check your connection and try again." };
    }
}

window.DillonBuildsProjectInquiry = {
    submitProjectInquiry,
    buildFilledPacketHtml,
    downloadTextFile,
    setPacketAnswers,
    packetStorageKey,
    fileLimits: projectFileLimits,
};

if (quoteForm) {
    quoteForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = quoteForm.querySelector("[type='submit']");
        const fileInput = quoteForm.querySelector("[data-project-files]");
        const files = fileInput?.files ? Array.from(fileInput.files) : [];
        const inquiry = normalizePricingInquiry(quoteForm);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        const result = await submitProjectInquiry(inquiry, files);

        if (result.ok) {
            setPacketAnswers(pricingInquiryToPacketAnswers(result.normalized));
            window.location.href = quoteForm.getAttribute("action") || "/thank-you.html";
            return;
        }

        alert(result.error);

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Quote Request";
        }
    });
}

if (filledPacketButton) {
    const answers = getPacketAnswers();

    if (packetStatus && !Object.keys(answers).length) {
        packetStatus.textContent = "No saved answers were found on this device yet. This will still create a packet with blank answer areas.";
    }

    filledPacketButton.addEventListener("click", () => {
        const packetAnswers = getPacketAnswers();
        const packetHtml = buildFilledPacketHtml(packetAnswers);
        downloadTextFile("dillon-builds-filled-welcome-packet.html", packetHtml);
    });
}
