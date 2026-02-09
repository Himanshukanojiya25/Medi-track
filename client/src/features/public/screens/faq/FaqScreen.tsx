import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { FaqList } from "./FaqList";

export function FaqScreen() {
  return (
    <>
      <SeoShell
        title="Frequently Asked Questions"
        description="Common questions about appointments, doctors and hospitals."
      />
      <main>
        <FaqList />
      </main>
    </>
  );
}
