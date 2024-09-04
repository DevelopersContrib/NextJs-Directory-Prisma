"use client"

import { createLinkAction } from "@/actions/link.action";
import FolderType from "@/types/folder.type";
import CategoryType from "@/types/category.type";
import { createLinkSchema } from "@/validations/link.validation";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
/*
type Errors = {
    title: string | null | undefined;
	description: string | null | undefined;
	userId: string | null | undefined;
	categoryId: string | null | undefined;
	company_name: string | null | undefined;
	company_logo: string | null | undefined;
	screenshot: string | null | undefined;
	url: string | null | undefined;
} | null*/

type Errors = {
    title?: string;
    categoryId?: string;
    description?: string;
    url?: string;
    company_name?: string;
    company_logo?: string;
    screenshot?: string;
} | null


type Props = {
    categories: CategoryType[];
    userId: string;
}

const CreateNewListingModal = ({ categories, userId }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const modal = searchParams.get('modal');
    const folderId = searchParams.get('folderId');
    const postId = searchParams.get('postId');

    const [errors, setErrors] = useState<Errors>(null);
    const [isMutation, setIsMutation] = useState(false);

    const clientAction = async (formData: FormData) => {
        if (isMutation) return null;
        setIsMutation(true);

        try {
            const data = {
                userId,
                categoryId: formData.get('categoryId') as string || "",
                title: formData.get('title') as string || "",
                description : formData.get('description') as string || "",
                url: formData.get('url') as string || "",
                company_name: formData.get('company_name') as string || "",
                company_logo: formData.get('company_logo') as string || "",
                screenshot: formData.get('screenshot') as string || "",
                path: window.location.pathname
            };

            const validations = createLinkSchema.safeParse(data);
            if (!validations.success) {
                let newErrors: Errors = {};

                validations.error.issues.forEach(issue => {
                    newErrors = {  [issue.path[0]]: issue.message };
                });

                setErrors(newErrors);
                return null;
            } else {
                setErrors(null);
            }

            const res = await createLinkAction(data);
            if (res.message === "Link created successfully.") {
                router.push(`/dashboard?categoryId=${res?.data?.categoryId}&linkId=${res?.data?.id}`);
            }
        } catch (error) {
            console.info(["[ERROR_CLIENT_ACTION]"], error);
        } finally {
            setIsMutation(false);
        }
    }

    const cancel = () => {
        if (folderId && postId) {
            router.push(`/dashboard?folderId=${folderId}&postId=${postId}`);
        } else if (folderId) {
            router.push(`/dashboard?folderId=${folderId}`);
        } else {
            router.push('/dashboard');
        }
    }

    return modal === 'open' ? (
        <div className="z-50 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary/15">
            <div className="p-30 rounded-3 bg-white shadow flex flex-col space-y-15 w-400">
                {/* Title */}
                <h1 className="font-sans text-34 font-semibold text-center text-primary">New Note</h1>

                {/* Title & Folder */}
                <form action={clientAction} className="flex flex-col gap-y-20">
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="title" className="label">Title</label>
                        <input type="text" placeholder="Title" id="title" name="title" className={`input ${errors?.title ? 'input-error' : null}`} />

                        {errors?.title && <p className="text-red-500 font-sans">{errors?.title}</p>}
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="folderId" className="label">Select Category</label>
                        <select className={`input ${errors?.categoryId ? 'input-error' : null}`} name="categoryId" id="categoryId">
                            {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                            ))}
                        </select>

                        {errors?.categoryId && <p className="text-red-500 font-sans">{errors?.categoryId}</p>}
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="title" className="label">Description</label>
                        <textarea placeholder="Description" id="description" name="description" className={`input ${errors?.description ? 'input-error' : null}`} />
                        
                        {errors?.description && <p className="text-red-500 font-sans">{errors?.description}</p>}
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="title" className="label">URL</label>
                        <input type="text" placeholder="URL" id="url" name="url" className={`input ${errors?.url ? 'input-error' : null}`} />

                        {errors?.url && <p className="text-red-500 font-sans">{errors?.url}</p>}
                        
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="title" className="label">Screenshot URL</label>
                        <input type="text" placeholder="Screenshot" id="screenshot" name="screenshot" className={`input ${errors?.screenshot ? 'input-error' : null}`} />

                        {errors?.screenshot && <p className="text-red-500 font-sans">{errors?.screenshot}</p>}
                        
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="title" className="label">Company Name</label>
                        <input type="text" placeholder="Company Name" id="company_name" name="company_name" className={`input ${errors?.company_name ? 'input-error' : null}`} />

                        {errors?.company_name   && <p className="text-red-500 font-sans">{errors?.company_name}</p>}
                        
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <label htmlFor="title" className="label">Company Logo URL</label>
                        <input type="text" placeholder="Company Logo" id="company_logo" name="company_logo" className={`input ${errors?.company_logo ? 'input-error' : null}`} />

                        {errors?.company_logo   && <p className="text-red-500 font-sans">{errors?.company_logo}</p>}
                        
                    </div>

                    {/* Button Submit & Cancel */}
                    <div className="flex flex-items-center gap-x-10">
                        {/* Submit */}
                        <button type="submit" className="btn btn-primary" disabled={isMutation}>
                            Save
                        </button>
                        {/* Cancel */}
                        <button type="button" className="w-fit flex-1 btn btn-danger" onClick={cancel} disabled={isMutation}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div >
    ) : null;
}

export default CreateNewListingModal