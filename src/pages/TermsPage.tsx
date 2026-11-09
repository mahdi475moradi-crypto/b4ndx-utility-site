import { LegalPage, LegalSection } from "./LegalPage";
import { SUPPORT_SERVER_URL } from "../lib/site";

export function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      documentTitle="Terms — B4NDX Utility"
      updated="November 2026"
      intro="These terms cover the B4NDX Utility Discord bot and this website. Adding the bot to a server, or using this site, means you accept them. They are written to be read, not to hide anything."
    >
      <LegalSection title="Using the bot">
        <p>
          B4NDX Utility is provided for managing Discord communities:
          moderation, support tickets, welcome and goodbye flows, logging,
          giveaways, polls, and everyday server management. Use it for lawful
          purposes and in line with Discord's Terms of Service and Community
          Guidelines — the bot operates inside Discord, so Discord's rules
          always apply alongside these terms.
        </p>
        <p>
          Don't use the bot to harass people, evade Discord's enforcement, run
          raids or spam, or attempt to disrupt, overload, or reverse-engineer
          the service.
        </p>
      </LegalSection>

      <LegalSection title="Your server, your responsibility">
        <p>
          You choose which permissions to grant, which modules to enable, and
          which channels the bot writes to. Moderation actions executed through
          the bot are issued by members of your own staff; making sure those
          people should have that authority is part of running your server.
        </p>
      </LegalSection>

      <LegalSection title="Availability and warranty">
        <p>
          The bot and the website are provided "as is" and "as available".
          Functionality may change as modules are improved, and there is no
          warranty of uninterrupted operation. If something breaks, the
          support server is the place to report it.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the extent permitted by law, the people behind B4NDX Utility are
          not liable for indirect or consequential damages arising from use of
          the bot or the website — including data loss in your server,
          moderation outcomes, or missed giveaway events. Nothing here limits
          liability that cannot be limited under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You can stop using the bot at any time by removing it from your
          server. Use that violates these terms or Discord's rules may result
          in the bot refusing service to a server or user.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          These terms may be updated as the product changes; the date above
          reflects the current version. Material changes will also be announced
          in the support server.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms:{" "}
          <a
            href={SUPPORT_SERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-rose-1 underline-offset-4 hover:underline"
          >
            discord.gg/bpE7tcwNCV
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
