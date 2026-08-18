import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({mode}) => {

    const env = loadEnv(mode, process.cwd(), ''); // Load all env variables

    console.log('Mode: ', mode);
    console.log('Environment Variables during build:');
    console.log(env);

    let base = "/crm-crm-main-frontend/"
    if(mode === "demo") {
        base = "/demo-crm-crm-main-frontend/"
    }

    return {
        base: base,
        plugins: [
            react(),
            svgr(),
            federation({
                name: 'app',
                remotes: {
                    // remoteApp: 'http://localhost:4173/assets/remoteEntry.js',
                    // cpqRemoteApp: 'http://localhost:5175/cpq-frontend-service/remoteEntry.js',
                    // workflowRemoteApp:"http://localhost:4173/crm-common-workflow-mf/remoteEntry.js",
                    //caseManagementRemoteApp:"http://localhost:3001/crm-common-case-management-mf/remoteEntry.js",
                    remoteApp: 'http://192.168.0.108:30509/crm-micro-frontned-child-app/assets/remoteEntry.js',
                    cpqRemoteApp: 'http://192.168.0.108:30509/cpq-frontend-service/remoteEntry.js',
                    workflowRemoteApp: "https://k8s-linknetdemo-8da485f2ee-1301521822.ap-southeast-1.elb.amazonaws.com/crm-common-workflow-mf/remoteEntry.js",
                    caseManagementRemoteApp:"https://k8s-linknetdemo-8da485f2ee-1301521822.ap-southeast-1.elb.amazonaws.com/crm-common-case-management-mf/remoteEntry.js"
                },
                shared: ['react', 'react-dom', 'react-router-dom', 'antd']
            })
        ],
        build: {
            modulePreload: false,
            target: 'esnext',
            minify: false,
            cssCodeSplit: false
        }
    }
})