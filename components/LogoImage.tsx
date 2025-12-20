import Image from "next/image";

type LogoImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function LogoImage({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 1024px) 320px, 240px",
}: LogoImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={512}
      height={512}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
