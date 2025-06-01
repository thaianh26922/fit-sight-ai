import { lazy, Suspense } from 'react'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyLoading = (importFunc: any) => {
  const LazyComp = lazy(async () => {
    NProgress.start()
    const module = await importFunc()
    NProgress.done()
    return module
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function LazyComponent(props: any) {
    return (
      <Suspense fallback={null}>
        <LazyComp {...props} />
      </Suspense>
    )
  }
}

export default lazyLoading
