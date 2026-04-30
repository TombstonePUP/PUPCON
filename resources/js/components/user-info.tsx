import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false, showRole = false }: { user: User; showEmail?: boolean; showRole?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={[user.first_name, user.last_name].filter(Boolean).join(' ')} />
                <AvatarFallback className="bg-muted text-muted-foreground rounded-lg">{getInitials(user.first_name, user.last_name)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-xs">
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{[user.first_name, user.last_name].filter(Boolean).join(' ')}</span>
                    {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
                </div>

                <div className="text-muted-foreground">{showRole && user.roles.role_name}</div>
            </div>
        </>
    );
}
