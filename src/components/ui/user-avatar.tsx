function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface UserAvatarProps {
  name?: string | null
  image?: string | null
  className?: string
}

export function UserAvatar({ name, image, className = "h-8 w-8 text-xs" }: UserAvatarProps) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User"}
        className={`${className} rounded-full object-cover shrink-0`}
      />
    )
  }

  const initials = name ? getInitials(name) : "?"

  return (
    <div
      className={`${className} rounded-full bg-primary flex items-center justify-center font-semibold text-primary-foreground shrink-0`}
    >
      {initials}
    </div>
  )
}
