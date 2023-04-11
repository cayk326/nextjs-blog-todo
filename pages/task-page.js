import { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { getAllTasksData } from "../lib/tasks";
import Task from "../components/Task";
import useSWR from "swr";

//エンドピントのURLを引数にしてfetchを行い,レスポンスをjson形式に変換
const fetcher = (url) => fetch(url).then((res) => res.json());
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`;


export default function TaskPage( {staticfilterdTasks }){

    //クライアントサイドからfetchしたいエンドポイントのパスを渡す
    //第二引数にfetcher関数を渡す
    //第三引数に初期データを渡す。getStaticPropsでビルド時に得た情報を初期データとする
    //入手したdataとmutateという関数を返す
    const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: staticfilterdTasks,
    });
    //tasksが存在する場合はソート関数によって作成順にソートしなおす
    const filteredTasks = tasks?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      //useSWRで取得できるデータのキャッシュを最新の状態に更新
    useEffect(() => {
        mutate();
    }, []);
    return (
        <Layout title="Task page">
            <ul>
                {filteredTasks &&
                    filteredTasks.map((task) => (
                    <Task key={task.id} task={task} taskDeleted={mutate}/>
                ))}
            </ul>
            <Link href="/main-page">
                <div className="flex cursor-pointer mt-12">
                    <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                    </svg>
                    <span>Back to main page</span>
                </div>
            </Link>
        </Layout>
    )
}

//ビルド時にTask一覧APIにアクセスして情報を取得
export async function getStaticProps() {
    const staticfilterdTasks = await getAllTasksData();
  
    return {
      props: { staticfilterdTasks },
      revalidate: 3,
    };
  }