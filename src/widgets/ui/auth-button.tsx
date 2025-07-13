'use client'
import { useAuth, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { LoadingSpinner } from '@/widgets'
import { Button } from '@/shared/ui'

export  function AuthButton() {
  const { isLoaded, isSignedIn } = useAuth()
  if (isLoaded && isSignedIn)
    return (
      <UserButton
        appearance={{
          elements: { userButtonAvatarBox: 'size-12' },
        }}
      />
    )
  if (!isLoaded) {
    return <LoadingSpinner className='size-12' />
  }
  return (
    <section className=" flex flex-nowrap flex-col">
      <SignUpButton mode="redirect">
        <Button className="px-2 text-white rounded bg-primary p-2">
          Sign Up
        </Button>
      </SignUpButton>
      <SignInButton mode="redirect">
        <Button className="px-2  rounded text-primary p-2">Sign In</Button>
      </SignInButton>
    </section>
  )
}
