export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}