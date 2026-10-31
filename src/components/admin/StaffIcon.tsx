const dimensions = {
    plus: 15,
    staff: 16,
    search: 17,
    filter: 17,
    down: 14,
    refresh: 17,
    previous: 16,
    next: 16,
    eye: 18,
    'select-down': 18,
    'staff-large': 23,
    close: 18,
    user: 17,
    lock: 17,
} as const;

export default function StaffIcon({
    name,
    className = '',
}: {
    name: keyof typeof dimensions;
    className?: string;
}) {
    return (
        <img
            src={`/images/admin/staff/${name}.svg`}
            alt=""
            width={dimensions[name]}
            height={dimensions[name]}
            className={`staff-icon ${className}`}
        />
    );
}
