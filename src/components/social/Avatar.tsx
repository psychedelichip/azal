interface AvatarProps {
  name: string;
  hue?: number;
  size?: number;
}

export function Avatar({ name, hue = 210, size = 32 }: AvatarProps) {
  const initials = name.replace("@", "").slice(0, 2).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-medium shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${hue} 55% 45%)` }}
    >
      {initials}
    </div>
  );
}
