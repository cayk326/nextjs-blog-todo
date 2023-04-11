
import Layout from "../components/Layout";
import Link from "next/link";
import { getAllPostsData } from "../lib/posts";
import Post from "../components/Post";


export default function BlogPage({ filteredPosts }){
    return (
        <Layout title="Blog page">
            <ul>
                {filteredPosts &&
                    filteredPosts.map((post) => <Post key={post.id} post={post} />)}
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
//ビルド時に呼び出されてサーバーサイドで実行される
export async function getStaticProps(){
    const filteredPosts = await getAllPostsData();//作成日時によってソートされたブログ投稿の一覧を取得
    //propsの形でreturnで返す. この値をblog-pageにpropsで渡すことでHTMLに埋め込まれて、事前に生成する
    return {
        props: { filteredPosts },
        revalidate: 3,
    };
}