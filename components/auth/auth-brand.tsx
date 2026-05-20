import Image from "next/image";

type Props = {
  title: string;
  description?: string;
  align?: "center" | "left";
  showLogo?: boolean;
};

export function AuthBrand({
  title,
  description,
  align = "center",
  showLogo = true,
}: Props) {
  const isLeft = align === "left";

  return (
    <div
      className={
        isLeft
          ? "flex flex-col items-start text-left"
          : "flex flex-col items-center text-center"
      }
    >
      {showLogo ? (
        <>
          <Image
            src="/images/conveners/npsc.png"
            alt="National Procurement and Supply Conference"
            width={160}
            height={52}
            priority
            className="h-10 w-auto object-contain sm:h-11"
          />
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            GIPS Ghana
          </p>
        </>
      ) : null}
      <h1
        className={
          isLeft
            ? "text-2xl font-semibold tracking-tight text-foreground"
            : "mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        }
      >
        {title}
      </h1>
      {description ? (
        <p
          className={
            isLeft
              ? "mt-2 max-w-md text-sm text-muted-foreground"
              : "mt-2 max-w-sm text-sm text-muted-foreground"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
