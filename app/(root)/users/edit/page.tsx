import React from 'react'
import { auth } from '@/auth'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

const EditProfilePage = async () => {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const { data: user} = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user?.id)
        .single();


  return (
    <div>
      your current username: {`${user.username}`}
      your current bio: {`${user.user_bio}`}
    </div>
  )
}

export default EditProfilePage
