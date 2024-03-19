import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';
import { useThreadStore } from './ThreadStore';
import { firebaseFireStoreService } from '@/services/firebaseFireStoreService';
import firebaseHelper from '@/helpers/firebaseHelper';
import type Post from '@/types/Post.ts';
import type Thread from '@/types/Thread';
import type PostAddToFirebaseRequest from '@/types/PostAddToFirebaseRequest';
import type PostAddRequest from '@/types/PostAddRequest';
import type PostUpdateRequest from '@/types/PostUpdateRequest';
import { FirebaseError } from 'firebase/app';
import { FirestoreCollection } from '@/enums/FirestoreCollection';
import { OrderByDirection } from '@/enums/OrderByDirection';

// const { findById, findManyById } = arraySearchHelper();

export const usePostStore = defineStore('PostStore', () => {
  //STATE
  const posts = ref<Post[]>([]);

  //GETTERS
  const getPostById = (postId: string | undefined): Post => {
    const matchingPost = posts.value.find((post: Post) => post.id === postId);
    if (matchingPost === undefined) return { id: '' };

    return matchingPost;
  };

  const getPostsByThreaId = (threadId: string | undefined): Post[] => {
    const matches = posts.value.filter(
      (post: Post) => post.threadId === threadId
    );
    return matches;
  };

  const getPostsByUserId = (userId: string | undefined): Post[] => {
    const matches = posts.value.filter((post: Post) => post.userId === userId);
    return matches;
  };

  const getThreadFirstPostBody = (thread: Thread) => {
    const match = posts.value.find((post) => post.id === thread.posts![0]);
    return match;
  };
  //ACTIONS
  const fetchPost = (id: string): Promise<Post> => {
    return useCommonStore().fetchItem<Post>({
      targetStore: posts,
      collection: FirestoreCollection.Posts,
      id,
    });
  };

  const fetchPosts = (ids: string[]): Promise<Post[]> => {
    return useCommonStore().fetchSomeItems<Post>({
      ids,
      targetStore: posts,
      collection: FirestoreCollection.Posts,
    });
  };

  const fetchPostsByUser = async (
    userId: string | undefined,
    lastPost: Post | null = null
  ) => {
    const userIdFinal =
      userId === undefined ? useUserStore().getAuthUser().id : userId;
    return await useCommonStore().fetchItemsByProp<Post>({
      collectionName: FirestoreCollection.Posts,
      propName: 'userId',
      propValue: userIdFinal,
      targetStore: posts,
      orderByDirection: OrderByDirection.Desc,
      orderByProp: 'publishedAt',
      startAtItem: lastPost,
    });
  };

  const fetchPostsByPage = async (
    ids: string[],
    chunkSize: number,
    chunkIndex: number
  ) => {
    return await useCommonStore().fetchItemsByChunk<Post>({
      targetStore: posts,
      collection: FirestoreCollection.Posts,
      ids,
      chunkSize,
      chunkIndex,
    });
  };

  const addPost = async (request: PostAddRequest) => {
    //console.log('calling addPost in PostStore', post);
    const postFirebaseRequest = request as unknown as PostAddToFirebaseRequest;
    postFirebaseRequest.publishedAt =
      firebaseFireStoreService().getServerTimeStamp();
    postFirebaseRequest.userId = useUserStore().getAuthUser().id!;
    const postRef = firebaseFireStoreService().doc(
      firebaseFireStoreService().collection(
        firebaseFireStoreService().db,
        'posts'
      )
    );
    const threadRef = firebaseFireStoreService().doc(
      firebaseFireStoreService().db,
      'threads',
      request.threadId!
    );
    const userRef = firebaseFireStoreService().doc(
      firebaseFireStoreService().db,
      'users',
      postFirebaseRequest.userId!
    );
    await firebaseFireStoreService()
      .writeBatch(firebaseFireStoreService().db)
      .set(postRef, { ...postFirebaseRequest })
      .update(threadRef, {
        posts: firebaseFireStoreService().arrayUnion(postRef.id),
        contributors: firebaseFireStoreService().arrayUnion(
          useUserStore().authId
        ),
      })
      .update(userRef, {
        postsCount: firebaseFireStoreService().increment(1),
      })
      .commit();

    const newPostRef = await firebaseFireStoreService().getDoc(postRef);
    const newPost = { ...newPostRef.data(), id: postRef.id };
    setPost(newPost);
    useThreadStore().appendPostToThread({
      postId: postRef.id,
      threadId: request.threadId,
    });
    return newPost as Post;
  };

  const updatePost = async (request: PostUpdateRequest) => {
    const postRef = firebaseFireStoreService().doc(
      firebaseFireStoreService().db,
      'posts',
      request.id
    );
    try {
      const batch = firebaseFireStoreService().writeBatch(
        firebaseFireStoreService().db
      );
      batch.update(postRef, {
        ...request,
      });
      await batch.commit();
    } catch (error) {
      console.error('PostStore>updatedPost>error', error as FirebaseError);
    }
    const updatedPost = firebaseHelper().docToResource(
      await firebaseFireStoreService().getDoc(postRef)
    );
    setPost(updatedPost);
  };

  const setPost = (post: Post) => {
    const index = posts.value.findIndex((element) => element.id === post.id);
    if (post.id && index !== -1) {
      posts.value![index] = post;
    } else {
      posts.value!.push(post);
    }
  };
  return {
    //state
    posts,
    //getters
    getPostById,
    getPostsByThreaId,
    getPostsByUserId,
    getThreadFirstPostBody,
    //actions
    fetchPost,
    fetchPosts,
    fetchPostsByUser,
    fetchPostsByPage,
    addPost,
    updatePost,
    setPost,
  };
});
