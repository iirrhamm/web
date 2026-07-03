import { createClient } from '../../utils/Supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: roleData } = await supabase
    .from('roles')
    .select('role')
    .eq('user_id', user.id)
    .single() 

    if (!roleData || roleData.role !== 'admin') {
        redirect('/')
    }

    return <>{children}</>
}