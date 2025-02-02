type RouteHandler = (params?: string | Record<any, any>) => Promise<void> | void

type RouteConfig = {
    path: string | RegExp | ((url: string) => boolean)
    onBeforeEnter?: RouteHandler
    onEnter?: RouteHandler
    onLeave?: RouteHandler
}

export class Router {
    private routes: RouteConfig[] = []
    private currentRoute: RouteConfig | null = null
    useHash: boolean
    basename: string

    constructor(useHash = false, basename) {
        this.useHash = useHash
        this.basename = basename;
        if (this.useHash) {
            window.addEventListener("hashchange", () => this.resolveRoute())
        } else {
            window.addEventListener("popstate", () => this.resolveRoute())
        }
    }

    addRoute(route: RouteConfig) {
        this.routes.push(route)
    }

    makeUrl(path: string) {
        return `${this.basename}${path}`
    }

    async navigate(path: string) {
        path = this.basename + path
        if (this.useHash) {
            window.location.hash = path
        } else {
            window.history.pushState({}, "", path)
        }
        await this.resolveRoute()
    }

    async resolveRoute() {
        const url = this.useHash ? window.location.hash.slice(1) : window.location.pathname
        const matchingRoute = this.routes.find(route =>
            typeof route.path === "string" ?
                route.path === url
                :
                route.path instanceof RegExp ?
                    route.path.test(url)
                    :
                    route.path(url)
        )

        if (matchingRoute) {
            if (this.currentRoute?.onLeave) {
                const leaveResult = await this.currentRoute.onLeave({})
                if (leaveResult === false) return
            }

            if (matchingRoute.onBeforeEnter) {
                const beforeEnterResult = await matchingRoute.onBeforeEnter({})
                if (beforeEnterResult === false) return
            }

            this.currentRoute = matchingRoute
            matchingRoute.onEnter?.(url.split('/city/')[1] || {})
        }
    }
}