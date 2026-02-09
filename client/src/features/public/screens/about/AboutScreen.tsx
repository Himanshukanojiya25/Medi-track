import { SeoShell } from "../../../../layouts/public/components/SeoShell";

export function AboutScreen() {
  return (
    <>
      <SeoShell
        title="About Us"
        description="Learn about our healthcare platform and mission."
      />

      <main className="about-page">
        <h1>About Our Platform</h1>

        <p>
          We are building a modern healthcare discovery and appointment platform
          that helps patients find the right doctors and hospitals faster.
        </p>

        <p>
          Our goal is to make healthcare accessible, transparent, and efficient
          for everyone.
        </p>
      </main>
    </>
  );
}
