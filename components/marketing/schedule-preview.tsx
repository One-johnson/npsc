import { mockEvent } from "@/lib/mock-event";

export function SchedulePreview() {
  return (
    <section id="schedule" className="py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <ul className="space-y-4">
          {mockEvent.agenda.map((item) => (
            <li
              key={item.time + item.title}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="shrink-0 text-sm font-semibold text-primary sm:w-36">
                {item.time}
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                {item.speaker ? (
                  <p className="text-sm text-muted-foreground">{item.speaker}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
