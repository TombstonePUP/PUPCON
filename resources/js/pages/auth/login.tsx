import { Head, useForm } from '@inertiajs/react';
import { ImageIcon, LoaderCircle } from 'lucide-react';
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

interface LandingProps {
    carouselImages: string[];
}

interface LoginPageProps extends LoginProps, LandingProps { }

export default function Login({
    status,
    canResetPassword,
    carouselImages = [],
}: LoginPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const images = carouselImages;

    const SimpleCarousel = React.memo(({ images }: { images: string[] }) => {
        const [current, setCurrent] = useState(0);

        useEffect(() => {
            if (!images || images.length === 0) return;

            images.forEach((src, index) => {
                if (index > 0) {
                    const img = new Image();
                    img.src = src;
                }
            });

            const interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % images.length);
            }, 4000);

            return () => clearInterval(interval);
        }, [images]);

        if (!images || images.length === 0) {
            return (
                <div className="absolute z-[-1] inset-0 flex items-center justify-center bg-gray-200">
                    <p>No images for carousel</p>
                </div>
            );
        }

        const SafeImage = React.memo(
            ({
                src,
                alt,
                className,
                priority = false,
                placeholderType = 'image',
            }: {
                src: string;
                alt: string;
                className: string;
                priority?: boolean;
                placeholderType?: 'image' | 'logo';
            }) => {
                const [isLoaded, setIsLoaded] = useState(false);
                const [hasError, setHasError] = useState(false);
                const [shouldLoad, setShouldLoad] = useState(priority);
                const imgRef = useRef<HTMLDivElement>(null);

                useEffect(() => {
                    if (!shouldLoad) {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if (entry.isIntersecting) {
                                    setShouldLoad(true);
                                    observer.disconnect();
                                }
                            },
                            { rootMargin: '100px' },
                        );
                        if (imgRef.current) observer.observe(imgRef.current);
                        return () => observer.disconnect();
                    }
                }, [shouldLoad]);

                const handleInternalError = () => {
                    setHasError(true);
                };

                const placeholderBaseClass = 'h-full w-full flex items-center justify-center bg-gray-100 rounded-inherit';

                const outerClassName = `relative overflow-hidden ${className || ''}`;

                return (
                    <div ref={imgRef} className={outerClassName}>
                        {hasError ? (
                            <div className={placeholderBaseClass}>
                                {placeholderType === 'logo' ? (
                                    <span className="text-lg font-semibold text-[#7f1414]">PUP</span>
                                ) : (
                                    <ImageIcon className="h-15 w-15 text-gray-300" />
                                )}
                            </div>
                        ) : shouldLoad ? (
                            <>
                                {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
                                <img
                                    src={src}
                                    alt={alt}
                                    className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setIsLoaded(true)}
                                    onError={handleInternalError}
                                    loading={priority ? 'eager' : 'lazy'}
                                />
                            </>
                        ) : (
                            <div className="h-full w-full animate-pulse bg-gray-200" />
                        )}
                    </div>
                );
            },
        );

        return (
            <div className="absolute inset-0">
                {images.map((src, index) => (
                    <div
                        key={src || index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <SafeImage src={src} alt={`Slide ${index + 1}`} className="h-full w-full" priority={index === 0} />
                    </div>
                ))}
            </div>
        );
    });

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />
            {/* <SimpleCarousel images={images} /> */}
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                {/* <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div> */}
            </form>


            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
