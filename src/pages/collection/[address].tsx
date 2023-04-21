import { useRouter } from 'next/router'
export default function CollectionPage() {
    const router = useRouter()
    const { address } = router.query

    return <div>Collection page: {address}</div>
}