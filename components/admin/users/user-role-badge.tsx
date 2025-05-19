export default function UserRoleBadge({ role }: { role: string }) {
  let badgeClass = "";

  switch (role) {
    case "ADMIN":
      badgeClass =
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      break;
    case "CUSTOMER":
      badgeClass =
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      break;
    default:
      badgeClass =
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
    >
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </span>
  );
}
