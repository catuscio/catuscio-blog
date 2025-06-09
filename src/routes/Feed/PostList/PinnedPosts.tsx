import PostCard from "src/routes/Feed/PostList/PostCard"
import React, { useMemo, useState, useEffect } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled"
import { filterPosts } from "./filterPosts"
import { DEFAULT_CATEGORY } from "src/constants"
import { TPost } from "src/types"
import { getPosts } from "src/apis/notion-client/getPosts"  


type Props = {
  q: string
}

const PinnedPosts: React.FC<Props> = ({ q }) => {
  const [allPosts, setAllPosts] = useState<TPost[]>([])  
    
  useEffect(() => {  
    const fetchAllPosts = async () => {  
      const posts = await getPosts()  
      setAllPosts(posts)  
    }  
    fetchAllPosts()  
  }, [])  

  const filteredPosts = useMemo(() => {  
    // 모든 타입의 포스트에서 직접 필터링  
    return allPosts.filter((post) => {  
      // 기본 유효성 검사  
      const postDate = new Date(post?.date?.start_date || post.createdTime)  
      const tomorrow = new Date()  
      tomorrow.setDate(tomorrow.getDate() + 1)  
      tomorrow.setHours(0, 0, 0, 0)  
        
      if (!post.title || !post.slug || postDate > tomorrow) return false  
        
      // 상태 필터링 (Public 또는 PublicOnDetail)  
      const validStatus = post.status.includes("Public") || post.status.includes("PublicOnDetail")  
      if (!validStatus) return false  
        
      // Pinned 조건  
      return post.tags?.includes("Pinned") ||   
             post.status.includes("PublicOnDetail") ||  
             post.type.includes("Paper")  
    })  
  }, [allPosts, q])

  if (filteredPosts.length === 0) return null

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="header">📌 Pinned Posts</div>
      </div>
      <div className="my-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} data={post} />
        ))}
      </div>
    </StyledWrapper>
  )
}

export default PinnedPosts

const StyledWrapper = styled.div`
  position: relative;
  .wrapper {
    display: flex;
    margin-bottom: 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }
  .header {
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
    align-items: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    cursor: pointer;
  }
`
