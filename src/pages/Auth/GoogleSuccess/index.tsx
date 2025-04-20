// 'use client'

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';

// const GoogleCompletePage = () => {
//     const router = useRouter();

//     useEffect(() => {
//         const token = new URLSearchParams(window.location.search).get('token');
//         if (!token) return router.push('/auth/login');

//         signIn('credentials', {
//             redirect: false,
//             email: decoded.email,
//             password: '__google__', // giả lập
//             accessToken: token,
//         }).then((res) => {
//             if (res?.ok) router.push('/');
//             else router.push('/auth/login');
//         });
//     }, [router]);

//     return <p className="text-sm text-center mt-8">Đang đăng nhập bằng Google...</p>;
// };

// export default GoogleCompletePage;