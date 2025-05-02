export function useInitials() {
    const getInitials = (firstName: string, lastName: string): string => {
        // const names = full_name.trim().split(' ');
        // const names = [first_name, lastName].filter(name => name.trim() !== '');
        const first_name = firstName.trim();
        const last_name = lastName.trim();

        if (first_name.length === 0) return '';
        if (first_name.length === 1) return first_name[0].charAt(0).toUpperCase();

        if (last_name.length === 0) return '';
        if (last_name.length === 1) return last_name[0].charAt(0).toUpperCase();

        const firstInitial = first_name[0].charAt(0);
        const lastInitial = last_name[0].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    return getInitials;
}
