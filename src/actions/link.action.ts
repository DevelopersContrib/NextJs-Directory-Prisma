"use server";

import {
  ICreateLink,
  IDeleteLinkPermanent,
  IUpdateLinkArchivedAt,
  IUpdateLinkBody,
  IUpdateLinkDeletedAt,
  IUpdateLinkFavoritedAt,
} from "@/interfaces/link.interface";
import prismadb from "@/lib/prismaDb";
import { revalidatePath } from "next/cache";

export const createLinkAction = async ({
  title,
  userId,
  categoryId,
  description,
  company_name,
  company_logo,
  screenshot,
  url,
  path,
}: ICreateLink) => {
  try {
    const link = await prismadb.link.create({
      data: {
        title,
        userId,
        categoryId,
        description,
        company_name,
        company_logo,
        screenshot,
        url,
      },
    });

    return { data: link, message: "Link created successfully." };
  } catch (error) {
    console.info(["[ERROR_CREATE_POST_ACTION]"], error);

    return { data: null, message: "Something went wrong." };
  } finally {
    revalidatePath(path);
  }
};

export const updateLinkBodyAction = async ({
  id,
  title,
  categoryId,
  description,
  company_name,
  company_logo,
  screenshot,
  path,
}: IUpdateLinkBody) => {
  try {
    const link = prismadb.link.update({
      where: { id },
      data: {
        title,
        categoryId,
        description,
        company_name,
        company_logo,
        screenshot,
      },
    });

    return {
      data: link,
      message: "Link updated successfully.",
    };
  } catch (error) {
    console.info("[ERROR_UPDATE_POST_BODY_ACTION]", error);

    return {
      data: null,
      message: "Something went wrong.",
    };
  } finally {
    revalidatePath(path);
  }
};

export const updateLinkDeletedAtAction = async ({
  linkId,
  path,
}: IUpdateLinkDeletedAt) => {
  try {
    const post = await prismadb.link.findUnique({
      where: {
        id: linkId,
      },
    });

    if (!post) {
      return {
        data: null,
        message: "Link not found.",
      };
    }

    if (post.deletedAt !== null) {
      await prismadb.link.update({
        where: {
          id: post.id,
        },
        data: {
          deletedAt: null,
        },
      });

      return {
        data: {
          postId: post.id,
          categoryId: post.categoryId,
        },
        message: "Link undeleted successfully.",
      };
    }

    await prismadb.link.update({
      where: {
        id: post.id,
      },
      data: {
        deletedAt: new Date(),
        archivedAt: null,
        favoritedAt: null,
      },
    });

    return {
      data: null,
      message: "LInk deleted successfully.",
    };
  } catch (error) {
    console.info("[ERROR_UPDATED_POST_DELETED_AT_ACTION]", error);

    return {
      data: null,
      message: "Something went wrong.",
    };
  } finally {
    revalidatePath(path);
  }
};

export const updatePostFavoritedAtAction = async ({
  linkId,
  path,
}: IUpdateLinkFavoritedAt) => {
  try {
    const post = await prismadb.link.findUnique({
      where: {
        id: linkId,
      },
    });

    if (!post) {
      return {
        data: null,
        message: "Post not found.",
      };
    }

    if (post.favoritedAt !== null) {
      await prismadb.link.update({
        where: {
          id: post.id,
        },
        data: {
          favoritedAt: null,
        },
      });

      return {
        data: null,
        message: "Link unfavorited successfully.",
      };
    }

    await prismadb.link.update({
      where: {
        id: post.id,
      },
      data: {
        archivedAt: null,
        favoritedAt: new Date(),
      },
    });

    return {
      data: null,
      message: "Post favorited successfully.",
    };
  } catch (error) {
    console.info("[ERROR_UPDATED_POST_FAVORITED_AT_ACTION]", error);

    return {
      data: null,
      message: "Something went wrong.",
    };
  } finally {
    revalidatePath(path);
  }
};

export const updateLinkArchivedAtAction = async ({
  linkId,
  path,
}: IUpdateLinkArchivedAt) => {
  try {
    const post = await prismadb.link.findUnique({
      where: {
        id: linkId,
      },
    });

    if (!post) {
      return {
        data: null,
        message: "Post not found.",
      };
    }

    if (post.archivedAt !== null) {
      await prismadb.link.update({
        where: {
          id: post.id,
        },
        data: {
          archivedAt: null,
        },
      });

      return {
        data: {
          postId: post.id,
          categoryId: post.categoryId,
        },
        message: "Link unarchived successfully.",
      };
    }

    await prismadb.link.update({
      where: {
        id: post.id,
      },
      data: {
        archivedAt: new Date(),
        favoritedAt: null,
      },
    });

    return {
      data: { linkId: post.id },
      message: "Link archived successfully.",
    };
  } catch (error) {
    console.info("[ERROR_UPDATED_POST_FAVORITED_AT_ACTION]", error);

    return {
      data: null,
      message: "Something went wrong.",
    };
  } finally {
    revalidatePath(path);
  }
};

export const deleteLinkPermanentAction = async ({
  linkId,
  path,
}: IDeleteLinkPermanent) => {
  try {
    const post = await prismadb.link.findUnique({
      where: {
        id: linkId,
      },
    });

    if (!post) {
      return {
        data: null,
        message: "Post not found.",
      };
    }

    if (post.deletedAt === null) {
      return {
        data: null,
        message: "Forbidden",
      };
    }

    await prismadb.post.delete({
      where: {
        id: post.id,
      },
    });

    return {
      data: null,
      message: "Post deleted permanently.",
    };
  } catch (error) {
    console.info("[ERROR_UPDATED_POST_FAVORITED_AT_ACTION]", error);

    return {
      data: null,
      message: "Something went wrong.",
    };
  } finally {
    revalidatePath(path);
  }
};
