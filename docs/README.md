# Sơ đồ kiến trúc dự án PhotoGo Frontend

Đây là sơ đồ tổng quan về cấu trúc thư mục, các thành phần và những thư viện chính được sử dụng trong dự án.

```mermaid
graph TB
    %% === NODE DEFINITIONS ===

    subgraph "PhotoGo Frontend Project"
        %% --- Root Configuration ---
        subgraph "Root Configuration"
            A[package.json]
            B[tsconfig.json]
            C[next.config.ts]
            D[tailwind.config.ts]
            E[docker-compose.yml]
            F[Dockerfile]
            G[nginx.conf]
        end

        %% --- Source Code Structure (src) ---
        subgraph "Source Code Structure"
            subgraph "App Layer"
                H[src/app/]
                H1[layout.tsx]
                H2[globals.css]
                H3[middleware.ts]
            end

            subgraph "Components (Atomic Design)"
                I[src/components/]
                I1[Atoms]
                I2[Molecules]
                I3[Organisms]
                I4[Templates]
            end

            subgraph "Business Logic (Services)"
                J[src/services/]
                J1[auth/]
                J2[booking/]
                J3[vendors/]
                J4[chat/]
                J5[payment/]
            end

            subgraph "Data Models"
                K[src/models/]
                K1[user/]
                K2[vendor/]
                K3[booking/]
                K4[payment/]
                K5[chat/]
            end

            subgraph "State Management (Stores)"
                L[src/stores/]
                L1[user/]
                L2[vendor/]
                L3[cart/]
                L4[chatting/]
            end

            subgraph "App Configuration"
                M[src/configs/]
                M1[env/]
                M2[fetch/]
                M3[socket/]
            end

            subgraph "Constants"
                N[src/constants/]
                N1[colors/]
                N2[common/]
                N3[errors/]
                N4[user/]
            end

            subgraph "Utilities & Hooks"
                O[src/utils/]
                O1[helpers/]
                O2[hooks/]
            end

            subgraph "Type Definitions"
                P[src/types/]
                P1[IComponents.d.ts]
                P2[IMetadata.d.ts]
                P3[IPages.d.ts]
            end

            subgraph "Pages Structure"
                Q[src/pages/]
                Q1[Admin/]
                Q2[Auth/]
                Q3[Member/]
                Q4[Public/]
                Q5[Status/]
                Q6[Vendor/]
            end
        end

        %% --- External Dependencies ---
        subgraph "External Dependencies"
            subgraph "Core Framework"
                R1[Next.js]
                R2[React]
                R3[TypeScript]
            end

            subgraph "UI & Styling"
                S1[Tailwind CSS]
                S2[Framer Motion]
                S3[Lucide React]
                S4[Radix UI]
            end

            subgraph "State & Forms"
                T1[Zustand]
                T2[React Hook Form]
                T3[Zod]
            end

            subgraph "Networking"
                U1[Axios]
                U2[Socket.io Client]
                U3[NextAuth]
            end

            subgraph "UI Components"
                V1[Embla Carousel]
                V2[React Dropzone]
                V3[React DatePicker]
                V4[Recharts]
            end
        end
    end

    %% === RELATIONSHIPS ===
    %% Internal Dependencies
    A --> H
    B --> H
    C --> H
    D --> I
    H --> I
    I --> J
    J --> K
    L --> J
    M --> J
    N --> I
    O --> J
    P --> K
    Q --> H

    %% External Dependencies to Source Code
    R1 --> H
    R2 --> I
    R3 --> P
    S1 --> I
    S2 --> I
    S3 --> I
    S4 --> I
    T1 --> L
    T2 --> I
    T3 --> K
    U1 --> J
    U2 --> J
    U3 --> J
    V1 --> I
    V2 --> I
    V3 --> I
    V4 --> I

    %% === STYLING ===
    classDef rootConfig fill:#e1f5fe,stroke:#0277bd
    classDef appLayer fill:#ede7f6,stroke:#5e35b1
    classDef components fill:#e8f5e9,stroke:#388e3c
    classDef services fill:#fff3e0,stroke:#f57c00
    classDef models fill:#fce4ec,stroke:#d81b60
    classDef stores fill:#f1f8e9,stroke:#7cb342
    classDef appConfig fill:#e0f7fa,stroke:#00838f
    classDef constants fill:#fffde7,stroke:#fbc02d
    classDef utils fill:#e0f2f1,stroke:#00695c
    classDef types fill:#eceff1,stroke:#546e7a
    classDef pages fill:#f3e5f5,stroke:#8e24aa
    classDef external fill:#ffebee,stroke:#c62828

    %% Apply styles to nodes
    class A,B,C,D,E,F,G rootConfig
    class H,H1,H2,H3 appLayer
    class I,I1,I2,I3,I4 components
    class J,J1,J2,J3,J4,J5 services
    class K,K1,K2,K3,K4,K5 models
    class L,L1,L2,L3,L4 stores
    class M,M1,M2,M3 appConfig
    class N,N1,N2,N3,N4 constants
    class O,O1,O2 utils
    class P,P1,P2,P3 types
    class Q,Q1,Q2,Q3,Q4,Q5,Q6 pages
    class R1,R2,R3,S1,S2,S3,S4,T1,T2,T3,U1,U2,U3,V1,V2,V3,V4 external
