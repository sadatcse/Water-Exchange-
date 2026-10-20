import { FaPhoneAlt, FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Bubbles from './Bubbles';
import Reveal from './Reveal';

export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Closing call-to-action used at the bottom of most pages
export default function CtaBand({
  title = 'Planning an ETP, STP or WTP?',
  text = 'Talk to an engineer today — we’ll guide you from design and installation to DOE clearance.',
}) {
  const phone = siteConfig.contact.phones[0];
  return (
    <section className="py-16 md:py-20">
      <Container className="max-w-6xl">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-abyss via-sky-800 to-cyan-600 px-6 py-12 text-center shadow-2xl shadow-sky-900/20 md:px-12 md:py-16 md:text-left">
          <Bubbles />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold text-white md:text-4xl">{title}</h2>
              <p className="mt-3 text-lg text-sky-100/85">{text}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
              <Button href={telHref(phone)} variant="white" size="lg" className="whitespace-nowrap">
                <FaPhoneAlt aria-hidden /> {phone}
              </Button>
              <Button href="/contact" variant="glass" size="lg" className="whitespace-nowrap">
                Send a message <FaArrowRight aria-hidden />
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
