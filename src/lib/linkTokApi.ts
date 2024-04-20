import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { stringify } from "querystring";
import internal from "stream";

interface Response {
  message: string;
  redirect: string;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface SigninCredentials {
  email: string;
  password: string;
}

interface SigninResponse {
  message: string;
  redirect: string;
  token: string;
}

interface UserDetailResponse {
  username: string;
  email: string;
  profilePictureURL: string;
  userBio: string;
  isActive: boolean;
}

interface createPostResponse {
  message: string;
}
interface getuserpostsResponse {
  message: string;
  posts: [
    {
      id: number;
      userId: number;
      caption: number;
      media: string;
      tags: string;
      location: string;
      scheduledAt: string;
      postType: string;
      is_scheduled: Boolean;
      likes: number;
      comments: number;
      shares: number;
      impressions: number;
      created_at: string;
      updated_at: string;
      mediaUrl: string;
    }
  ];
}

interface createStoryResponse {
  message: string;
}

interface getusersStroyResponse {
  stories: [
    {
      user_id: number;
      username: string;
      story_id: number;
      mediaURL: string;
    }
  ];
}

interface getusersearchResponse {
  search: [
    {
      id: number;
      username: string;
      isFollowing: boolean;
      profilePictureUrl: string;
    }
  ];
}

interface getFollowngResponse {
  following: [
    {
      target_id: number;
      username: string;
      profilePictureURL: string;
    }
  ];
}

interface getFollowergResponse {
  followers: [
    {
      user_id: number;
      username: string;
      profilePictureURL: string;
    }
  ];
}

interface updatedetailsResponse {
  message: string;
}

// Define a service using a base URL and expected endpoints
export const linkTokApi = createApi({
  reducerPath: "linkTokApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation<Response, SignupCredentials>({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
    signinUser: builder.mutation<SigninResponse, SigninCredentials>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserDetail: builder.query<UserDetailResponse, void>({
      query: () => ({
        url: "userdetail",
        method: "GET",
      }),
    }),
    createPost: builder.mutation<createPostResponse, FormData>({
      query: (credentials) => ({
        url: "createpost",
        method: "Post",
        body: credentials,
      }),
    }),
    getuserposts: builder.query<getuserpostsResponse, void>({
      query: () => ({
        url: "getuserposts",
        method: "GET",
      }),
    }),
    createStory: builder.mutation<createStoryResponse, FormData>({
      query: (credentials) => ({
        url: "createstory",
        method: "Post",
        body: credentials,
      }),
    }),
    getuserstory: builder.query<getusersStroyResponse, void>({
      query: () => ({
        url: "viewstory",
        method: "GET",
      }),
    }),
    getusersearch: builder.query<getusersearchResponse, string>({
      query: (searchText) => ({
        url: `search?searchText=${encodeURIComponent(searchText)}`,
        method: "GET",
      }),
    }),
    sendRequest: builder.mutation<string, { target_id: number }>({
      query: (credentials) => ({
        url: "sendrequest",
        method: "POST",
        body: credentials,
      }),
    }),
    unfollow: builder.mutation<string, { target_id: number }>({
      query: (credentials) => ({
        url: "unfollow",
        method: "POST",
        body: credentials,
      }),
    }),
    getFollowing: builder.query<getFollowngResponse, void>({
      query: () => ({
        url: "getfollowing",
        method: "GET",
      }),
    }),
    getFollowers: builder.query<getFollowergResponse, void>({
      query: () => ({
        url: "getfollowers",
        method: "GET",
      }),
    }),
    updatedetails: builder.mutation<updatedetailsResponse, FormData>({
      query: (credentials) => ({
        url: "updatedetails",
        method: "POST",
        body: credentials,
      }),
    }),
    viewfollowingpost: builder.query<
      {
        followingPost: [
          {
            user_id: Number;
            username: string;
            profile_picture: string;
            post_id: number;
            mediaURL: string;
            profilePictureUrl: string;
            like_count: number;
            comment_count: number;
          }
        ];
      },
      void
    >({
      query: () => ({
        url: "viewfollowingpost",
        method: "GET",
      }),
    }),
    likepost: builder.mutation< {message:string} , { post_id: Number }>({
      query: (credentials) => ({
        url: "likepost",
        method: "POST",
        body: credentials,
      }),
    }),
    
    createcomment: builder.mutation<
      { message: string },
      { post_id: number; commentText: string }
    >({
      query: (credentials) => ({
        url: "createcomment",
        method: "POST",
        body: credentials,
      }),
    }),
   

    viewcomments: builder.query<{ commentsData: Array<{ id:number;username: string; profilePictureUrl: string; commentText: string }> },number>({
      query: (post_id) => ({
        url: `viewcomments?post_id=${encodeURIComponent(post_id)}`,
        method: "GET",
      }),
    }),
    
    //admin endpointes 
      // getreports
      // deletereport
      // getblockedusers
      // blockuser
      // unblockuser
      // getactiveusers
      // getinactiveusers

      getReposts: builder.query<{
        reports: Array<{
          reportId: number;
          reportedById: number;
          reportedByUsername: string;
          reportedByProfilePic: string;
          reportedForId: number;
          reportedForUsername: string;
          reportedForProfilePic: string;
          post: {
            id: number;
            userId: number;
            caption: string;
            media: string;
            tags: string;
            location: string | null;
            scheduledAt: string | null;
            postType: string;
            is_scheduled: number;
            likes: number;
            comments: number;
            shares: number;
            impressions: number;
            isblocked: number;
            created_at: string;
            updated_at: string;
          };
          reason: string;
        }>;
      }, number>({
        query: () => ({
          url: "getreports", 
          method: "GET",
        }),
      }),
      
     
      deleteReport: builder.mutation<void, number>({
        query: (reportId) => ({
          url: `/api/admin/deletereport`,
          method: 'POST',
          body: { report_id: reportId },
        }),
      }),
   

      getBlockedUsers: builder.query<{ blockedUsers: Array<{ id: number; username: string; email: string; profilePicture: string; userBio: string | null; isActive: number; isAdmin: number; isblocked: number; remember_token: string | null; created_at: string; updated_at: string; profilePictureUrl: string; }> }, void>({
        query: () => ({
          url: '/api/admin/getblockedusers',
          method: 'GET',
        }),
      }),



      blockUser: builder.mutation<{ message: string }, number>({
        query: (userId) => ({
          url: '/api/admin/blockuser',
          method: 'POST',
          body: { user_id: userId },
        }),
      }),
      


unblockUser: builder.mutation<{ message: string }, number>({
  query: (userId) => ({
    url: '/api/admin/unblockuser',
    method: 'POST',
    body: { user_id: userId },
    
  }),
}),

// Add this inside your reportApi.ts or equivalent file where you define your API endpoints

getActiveUsers: builder.query<{ activeUsers: Array<{ id: number; username: string; email: string; password: string; profilePicture: string; userBio: string | null; isActive: number; isAdmin: number; isblocked: number; remember_token: string | null; created_at: string; updated_at: string; profilePictureUrl: string; }> }, void>({
  query: () => ({
    url: '/api/admin/getactiveusers',
    method: 'GET',
    
  }),
}),

// Add this inside your reportApi.ts or equivalent file where you define your API endpoints

getInactiveUsers: builder.query<{ inactiveUsers: Array<{ id: number; username: string; email: string; password: string; profilePicture: string; userBio: string | null; isActive: number; isAdmin: number; isblocked: number; remember_token: string | null; created_at: string; updated_at: string; profilePictureUrl: string; }> }, void>({
  query: () => ({
    url: '/api/admin/getinactiveusers',
    method: 'GET',
    
  }),
}),


  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSignupUserMutation,
  useSigninUserMutation,
  useGetUserDetailQuery,
  useCreatePostMutation,
  useGetuserpostsQuery,
  useCreateStoryMutation,
  useGetuserstoryQuery,
  useGetusersearchQuery,
  useSendRequestMutation,
  useUnfollowMutation,
  useGetFollowingQuery,
  useGetFollowersQuery,
  useUpdatedetailsMutation,
  useViewfollowingpostQuery,
  useLikepostMutation,

  useCreatecommentMutation,
useViewcommentsQuery,

} = linkTokApi;
