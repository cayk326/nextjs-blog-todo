//ビルド時にAPIからブログ情報を取得し、サーバーサイドで静的なHTMLを生成
//Django RESTAPIによって実現. サーバーサイドでNodeのfetchを使ってエンドポイントにアクセス


export async function getAllPostsData(){
    //ブログリストを返すAPIのエンドポイント
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
    );

    const posts = await res.json();// 受け取ったresponseをjson形式に変換する
    
    //created_atに基づいてソートする
    const filteredPosts = posts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)//created_atが大きい順になるように
    );
    return filteredPosts;
}

