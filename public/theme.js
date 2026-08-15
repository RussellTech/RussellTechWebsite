(() => {
  const root = document.documentElement;

  const storedTheme = (() => {
    try {
      return localStorage.getItem("russell-tech-theme");
    } catch {
      return null;
    }
  })();

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    root.dataset.theme = isLight ? "light" : "dark";

    const toggle = document.querySelector(".theme-toggle");
    toggle?.setAttribute("aria-pressed", String(isLight));
    toggle?.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );

    const label = toggle?.querySelector(".theme-label");
    if (label) label.textContent = isLight ? "Dark" : "Light";

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isLight ? "#f4f7ff" : "#030914");
    document
      .querySelector("#theme-favicon")
      ?.setAttribute(
        "href",
        isLight ? "/favicon-light.svg" : "/favicon-dark.svg",
      );
  };

  const animateThemeToggle = () => {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    toggle.classList.remove("theme-switching");
    void toggle.offsetWidth;
    toggle.classList.add("theme-switching");
    window.setTimeout(() => toggle.classList.remove("theme-switching"), 700);
  };

  applyTheme(storedTheme === "light" ? "light" : "dark");

  const bindThemeToggle = () => {
    applyTheme(root.dataset.theme === "light" ? "light" : "dark");
    document.querySelector(".theme-toggle")?.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      animateThemeToggle();
      try {
        localStorage.setItem("russell-tech-theme", nextTheme);
      } catch {}
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindThemeToggle, {
      once: true,
    });
  } else {
    bindThemeToggle();
  }
})();
