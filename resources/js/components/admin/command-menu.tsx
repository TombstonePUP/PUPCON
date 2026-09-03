import { useAuth } from '@/auth-context';
import { useSearch } from '@/components/search-provider';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { buildNavGroups } from '@/data/sidebar';
import { ArrowRight, ChevronRight } from 'lucide-react';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CommandMenu() {
    const navigate = useNavigate();
    const { open, setOpen } = useSearch();
    const { user } = useAuth();

    // Only show commands the current user has access to
    const navGroups = useMemo(() => {
        const roles = user?.roles?.map((r) => r.toLowerCase()) ?? [];
        return buildNavGroups(roles);
    }, [user?.roles]);

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false);
            command();
        },
        [setOpen],
    );

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <ScrollArea type="hover" className="h-72 pe-1">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {navGroups.map((group) => (
                        <CommandGroup key={group.title ?? 'root'} heading={group.title}>
                            {group.items.map((navItem, i) => {
                                if ('url' in navItem && navItem.url)
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => navigate(navItem.url as string));
                                            }}
                                        >
                                            <div className="flex size-4 items-center justify-center">
                                                <ArrowRight className="text-muted-foreground/80 size-2" />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    );

                                return navItem.items?.map((subItem, j) => (
                                    <CommandItem
                                        key={`${navItem.title}-${subItem.url}-${j}`}
                                        value={`${navItem.title}-${subItem.url}`}
                                        onSelect={() => {
                                            runCommand(() => navigate(subItem.url as string));
                                        }}
                                    >
                                        <div className="flex size-4 items-center justify-center">
                                            <ArrowRight className="text-muted-foreground/80 size-2" />
                                        </div>
                                        {navItem.title} <ChevronRight /> {subItem.title}
                                    </CommandItem>
                                ));
                            })}
                        </CommandGroup>
                    ))}
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    );
}
