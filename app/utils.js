import {BookOpenIcon, Cog6ToothIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import {ChatBubbleLeftRightIcon, ClipboardIcon, MegaphoneIcon, TableCellsIcon} from "@heroicons/react/24/outline";
import originMoment from 'moment'
import 'moment/locale/zh-tw'
import Swal from "sweetalert2";

export async function api(method, endpoint, jsonBody, options = {
    disableError: false,
}) {
    const SSR = typeof window === "undefined"
    return fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + endpoint, {
        method,
        body: (method === "GET" || typeof jsonBody === "undefined") ? null : JSON.stringify(jsonBody),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',

            // 如果不是 SSR，就加上 Authorization
            ...(!SSR && {
                'Authorization': 'Bearer ' + localStorage?.getItem('token')
            })
        }
    }).then(async (res) => {
        // 避免 migration 後的 token 失效
        if (res.status === 401 && !SSR) {
            localStorage?.removeItem('token')
        }
        const data = await res.json()
        if (res.status >= 400) {
            if(options.disableError) return Promise.reject(data)
            await Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: data?.message ?? '未知錯誤'
            })
            return Promise.reject(data)
        }
        return data
    })
}

export function makeFeature(params) {
    return [
        {
            id: 'bulletin',
            name: '公告',
            path: `/course/${params.course_id}/bulletin`,
            icon: MegaphoneIcon,
        },
        {
            id: 'unit',
            name: '單元',
            path: `/course/${params.course_id}/unit`,
            icon: BookOpenIcon,
        },
        {
            id: 'contest',
            name: '競賽',
            path: `/course/${params.course_id}/contest`,
            icon: ClipboardIcon,
        },
        {
            id: 'problem',
            name: '題庫',
            path: `/course/${params.course_id}/problem`,
            icon: PencilSquareIcon,
        },
        {
            id: 'scores_checking',
            name: '成績查詢',
            path: `/course/${params.course_id}/scores_checking`,
            icon: TableCellsIcon,
        },
        {
            id: 'discuss',
            name: '討論區',
            path: `/course/${params.course_id}/discuss`,
            icon: ChatBubbleLeftRightIcon,
        },
        {
            id: 'manage',
            name: '管理',
            path: `/course/${params.course_id}/manage`,
            icon: Cog6ToothIcon,
        }
    ]
}

originMoment.locale('zh-tw')
export const moment = originMoment

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}