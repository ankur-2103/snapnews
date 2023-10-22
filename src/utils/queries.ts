import { gql } from "@apollo/client";

const GET_USER_ID = gql`
query GetUser($id:String!){
    usersCollection(filter:{id: {eq: $id}}){
        edges{
            node{
                id
                user_name
                following
                notifications
                photo
                saved
            }
        }
    }
}
`

const GET_USER_USERNAME = gql`
query GetUser($user_name:String!){
    usersCollection(filter:{user_name: {startsWith: $user_name}}){
        edges{
            node{
                id
                user_name
                photo
            }
        }
    }
}
`
const GET_USERS_ID = gql`
query GetUser($user_name:[String!]){
    usersCollection(filter:{user_name: {in: $user_name}}){
        edges{
            node{
                id
                notifications
            }
        }
    }
}
`
const GET_USERS = gql`
query GetUser($id:[String!]){
    usersCollection(filter:{id: {in: $id}}){
        edges{
            node{
                id
                user_name
                photo
            }
        }
    }
}
`

const GET_FOLLOWING = gql`
query GetUser($id:[String!]){
    usersCollection(filter:{id: {in: $id}}){
        edges{
            node{
                id
                user_name
                photo
            }
        }
    }
}
`

const CREATE_USER = gql`
mutation addUser($id:String!, $user_name:String!){
    insertIntoUsersCollection(objects: {id: $id, user_name:$user_name}){
        records{
            id
            user_name
            following
            notifications
            photo
        }
    }
}
`

const UPDATE_USER = gql`
mutation Up($user:UsersUpdateInput!, $id:String!){
    updateUsersCollection(set:$user, filter:{id:{eq:$id}}){
        records{
            id
        }
    }
}
`;

const CREATE_POST = gql`
mutation createPost ($id:String!, $user_id:String!, $user_name:String!, $user_photo:String!, $description:String!, $tags:[String]!, $photo:String){
    insertIntoPostsCollection(objects:{id:$id, user_id:$user_id, user_name:$user_name, user_photo:$user_photo,description:$description, tags:$tags, photo:$photo}){
        affectedCount
    }
}
`;

const UPDATE_POST = gql`
mutation Update($post:PostsUpdateInput!, $id:String!){
    updatePostsCollection(set:$post, filter:{id:{eq:$id}}){
        records{
            id
            user_id
                user_name
                user_photo
                created_at
                description
                tags
                photo
                likes
        }
    }
}
`;

const UPDATE_POSTS = gql`
mutation Update($post:PostsUpdateInput!, $id:[String!]){
    updatePostsCollection(set:$post, filter:{id:{in:$id}}){
        records{
            id
                user_id
                user_name
                user_photo
                created_at
                description
                tags
                photo
                likes
        }
    }
}
`;

const GET_USER_POSTS = gql`
query GetUser($user_id:String!){
    postsCollection(filter:{user_id: {eq: $user_id}}){
        edges{
            node{
                id
                user_id
                user_name
                user_photo
                created_at
                description
                tags
                photo
                likes
            }
        }
    }
}
`
const GET_POST_ID = gql`
query GetPosts($id:String!){
    postsCollection(filter:{id:{eq:$id}}){
        edges{
            node{
                id
                user_id
                user_name
                user_photo
                created_at
                description
                tags
                photo
                likes
            }
        }
    }
}
`
const GET_NEWS_POSTS = gql`
query GetUser($user_id:[String!]){
    postsCollection(filter:{user_id: {in: $user_id}}){
        edges{
            node{
                id
                user_id
                user_name
                user_photo
                created_at
                description
                tags
                photo
                likes
            }
        }
    }
}
`

const GET_SAVED_POSTS = gql`
query GetUser($id:[String!]){
    postsCollection(filter:{id: {in: $id}}){
        edges{
            node{
                id
                user_id
                user_name
                user_photo
                created_at
                description
                tags
                photo
                likes
            }
        }
    }
}
`

const DELETE_POST = gql`
mutation DeletePost($id:String!){
    deleteFromPostsCollection(filter:{id:{eq:$id}}){
       affectedCount
    }
}
`
export {GET_USER_ID, GET_USER_USERNAME, GET_USERS, CREATE_USER, CREATE_POST, UPDATE_POST, GET_USER_POSTS, UPDATE_USER, DELETE_POST, GET_NEWS_POSTS, GET_FOLLOWING, GET_USERS_ID, GET_POST_ID, GET_SAVED_POSTS, UPDATE_POSTS}