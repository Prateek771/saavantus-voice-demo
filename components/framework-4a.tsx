export function Framework4A() {
  const steps = [
    {
      title: "Assess",
      body: "Deep analysis of your current workflows, bottlenecks, and automation opportunities.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: "Architect",
      body: "Design intelligent automation solutions tailored to your specific business processes.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12 2 10 5-10 5-10-5Z" />
          <path d="m2 12 10 5 10-5" />
          <path d="m2 17 10 5 10-5" />
        </svg>
      ),
    },
    {
      title: "Adjust",
      body: "Fine-tune and optimize automation workflows for maximum efficiency and accuracy.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      title: "Automate",
      body: "Deploy AI agents and automated systems that scale seamlessly with your business.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="framework"
      className="home-framework container"
      aria-labelledby="framework-title"
    >
      <div className="home-framework-header" data-reveal>
        <h2 id="framework-title">The SaaS 4A Framework</h2>
        <p>Our proven methodology for delivering intelligent, scalable automation.</p>
      </div>
      <div className="home-framework-grid">
        {steps.map((step, index) => (
          <div key={step.title} className="home-framework-step" data-reveal>
            <div className="home-framework-top">
              <div className="home-framework-icon">{step.icon}</div>
              {index < steps.length - 1 && (
                <div className="home-framework-connector" aria-hidden="true" />
              )}
            </div>
            <h3 className="home-framework-name">{step.title}</h3>
            <p className="home-framework-body">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
