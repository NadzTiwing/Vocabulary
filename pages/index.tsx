import Header from "./components/header";
import Main from "./components/main";
import { server } from "./config/index";
import { SSRProvider } from "react-bootstrap";

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${server}/api/posts`, {
    method: "GET"
  });
  const data = await res.json();
  
  // Pass data to the page via props
  return { props: { data: data.result } }
}

export default function Home({ data }: any) {
  return (
    <SSRProvider> 
      <Header/>
      <Main posts={data}/>
    </SSRProvider>
  )
}
