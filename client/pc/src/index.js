import WebVRApp from '@/core'
// create routers map 
WebVRApp.create([
    {
        path: '/singlePlayer', // e.g http://127.0.1:9000/
        component: () => import('@/views/singlePlayer.js')
    }
],document.querySelector('.webvr-container')
);