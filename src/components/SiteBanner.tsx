import Image from "next/image";

export default function SiteBanner({
  containerClassName = "max-w-3xl",
  priority = false,
}: {
  containerClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className="px-4 pt-4">
      <div className={`mx-auto w-full ${containerClassName}`}>
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/20">
          <div className="relative h-28 sm:h-40">
            <Image
              src="/banner.png"
              alt="TSL 배너"
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
