import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router"

import { addRecommendationThunk,
    deleteRecipeThunk,
    findIntRecipeByIDThunk,
    removeRecommendationThunk } from "./int-recipe-thunks";
import RecipeTable from "../ext-recipe/recipe-table";
import {Link} from "react-router-dom";
import {createCommentThunk, findCommentByRecipeThunk} from "../comments/comments-thunks";
import {
    customerLikesRecipeThunk,
    customerUnLikesRecipeThunk,
    findCustomersWhoLikeRecipeThunk
} from "../likes/likes-thunks";
import {gourmetRecommendsRecipeThunk, gourmetUnrecommendsRecipeThunk} from "../recommendations/recommendations-thunks";

const IntRecipeDetails = () => {
    const {intRecipeID} = useParams()
    const {currentUser} = useSelector((state) => state.users)
    const {int_recipe_details} = useSelector((state) => state.int_recipe)
    const {comments} = useSelector((state) => state.comments)
    const { likes } = useSelector((state) => state.likes)
    const [comment, setComment] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(findCommentByRecipeThunk(intRecipeID))
        dispatch(findIntRecipeByIDThunk(intRecipeID))
        dispatch(findCustomersWhoLikeRecipeThunk(intRecipeID))
    }, [])

    const handleCreateCommentBtn = () => {
        const response = dispatch(createCommentThunk({
            comment: comment,
            recipeID: intRecipeID
        }))
        response.then((data) => {
            console.log("commented!")
            dispatch(findCommentByRecipeThunk(intRecipeID))
            setComment('')
        })

    }

    const handleDeleteRecipeBtn = () => {
        try {
            const response = dispatch(deleteRecipeThunk(intRecipeID))
            response.then((res) => {
                console.log("delete!")
                navigate('/')
            })
        } catch (e) {
            navigate('/delete-recipe/fail')
        }
    }

    const toggleLikeBtn = () => {
        if (!currentUser || currentUser.usertype !== 'CUSTOMER') {
            return
        }
        if (doesCurrentUserLikeRecipe()) {
            // unlike
            try {
                const response = dispatch(customerUnLikesRecipeThunk({
                    cid: currentUser._id,
                    rid: intRecipeID,
                }))
                response.then((data) => {
                    dispatch(findCustomersWhoLikeRecipeThunk(intRecipeID))
                })
            } catch (e) {
                console.log('failed to unlike recipe')
            }
        } else {
            // like
            try {
                const response = dispatch(customerLikesRecipeThunk({
                    cid: currentUser._id,
                    rid: intRecipeID,
                }))
                response.then((data) => {
                    dispatch(findCustomersWhoLikeRecipeThunk(intRecipeID))
                })
            } catch (e) {
                console.log('failed to like recipe')
            }
        }
    }

    const recommendBtn = () => {
        if (!currentUser || currentUser.usertype !== 'GOURMET') {
            return
        }
        try {
            const response1 = dispatch(gourmetRecommendsRecipeThunk({
                gid: currentUser._id,
                rid: intRecipeID,
            }))
            response1.then(() => {
                const response2 = dispatch(addRecommendationThunk({
                    rid: intRecipeID,
                    recommendedByID: currentUser._id,
                    recommendedByName: currentUser.username
                }))
                response2.then(() => {
                    dispatch(findIntRecipeByIDThunk(intRecipeID))
                })
            })
        } catch (e) {
            console.log('failed to recommend recipe')
        }
    }

    const unrecommendBtn = () => {
        if (!currentUser || currentUser.usertype !== 'GOURMET') {
            return
        }
        try {
            const response1 = dispatch(gourmetUnrecommendsRecipeThunk({
                gid: currentUser._id,
                rid: intRecipeID,
            }))
            response1.then(() => {
                const response2 = dispatch(removeRecommendationThunk(intRecipeID))
                response2.then(() => {
                    dispatch(findIntRecipeByIDThunk(intRecipeID))
                })
            })
        } catch (e) {
            console.log('failed to unrecommend recipe')
        }
    }

    const doesCurrentUserLikeRecipe = () => {
        let liked = false;
        if (!currentUser) {
            return false
        }
        likes.forEach((like) => {
            if (currentUser && like && like.customer._id === currentUser._id) {
                liked = true
            }
        })
        return liked
    }

    const isRecommended = () => {
        let recommended = false;
        if (int_recipe_details.recommendedByID && int_recipe_details.recommendedByID.length > 0) {
            recommended = true
        }
        return recommended
    }

    const isRecommendedByCurrentUserGourmet = () => {
        let isMyRecommendation = false;

        if (int_recipe_details && currentUser && int_recipe_details.recommendedByID === currentUser._id) {
            isMyRecommendation = true
        }

        return isMyRecommendation
    }

    return (
        <>
            {
                (currentUser && (currentUser._id === int_recipe_details.chefID)) && (
                    <button
                        className="btn btn-warning float-end"
                        onClick={handleDeleteRecipeBtn}>Delete
                    </button>
                )
            }

            <h1  className="aaa edit-label mb-3">{int_recipe_details.name}</h1>

            {currentUser && (
                <div id="create-by">
                    Created By
                    <Link to={`/profile/${int_recipe_details.chefID}`}> {int_recipe_details.chef}
                    </Link>
                </div>)
            }

            <div className="row">
                <div className="col">
                    <img alt="" class=" rounded-4 mt-2 mb-2 pic1"  src={int_recipe_details.picture} height={500}/>
                </div>
            </div>
            <div>
                <h2 className="edit-label mt-5">Category</h2>
                <p className="btn btn-success fs-5 " >{int_recipe_details.category}</p>
                <h2 className="edit-label mt-5">Ingredients</h2>
                { int_recipe_details &&
                    (<RecipeTable param={int_recipe_details.ingredients}/>)
                }
                <br/>
                <h2 className="edit-label mt-5">Instructions</h2>
                <p className="instructions fst-normal fw-bolder">{int_recipe_details.instructions}</p>
            </div>
            <br/>

            {
                (currentUser && (currentUser.usertype === 'GOURMET') && !isRecommended())
                &&
                (
                    <button
                        className={`btn btn-primary float-end`}
                        onClick={recommendBtn}>Recommend
                    </button>
                )
            }

            {
                (currentUser && (currentUser.usertype === 'GOURMET')
                    && isRecommended() && isRecommendedByCurrentUserGourmet())
                &&
                (
                    <button
                        className={`btn btn-primary float-end`}
                        onClick={unrecommendBtn}>Unrecommend
                    </button>
                )
            }

            {
                (isRecommended() && !isRecommendedByCurrentUserGourmet()) &&
                (
                    <div className="mb-4">
                        Recommended by
                        <Link to={`/profile/${int_recipe_details.recommendedByID}`}> {int_recipe_details.recommendedByName}
                        </Link>
                    </div>
                )
            }

            {
                (!currentUser || (currentUser && (currentUser.usertype === 'CUSTOMER'))) &&
                (<i onClick={toggleLikeBtn}
                className={`bi ${doesCurrentUserLikeRecipe() ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}`}/>)
            }

            <br/>

            {
                (currentUser && (currentUser.usertype === 'CUSTOMER')) &&
                <div className="mt-10">
                    <textarea
                        onChange={(e) => setComment(e.target.value)}
                        className="form-control mt-4"
                        value={comment}
                    />
                    <button className="mt-2 btn btn-primary float-end" onClick={handleCreateCommentBtn}>Comment</button>
                </div>
            }

            <br/>

            <div className="mt-5">
            <ul className="list-group" id="comments">
                {
                    comments.map((comment) =>
                        <li className="list-group-item">
                            {comment.comment}
                            <Link to={`/profile/${comment.customer._id}`} className="float-end">
                                {comment.customer.username}
                            </Link>
                        </li>
                    )
                }
            </ul>
            </div>


        </>
    )
}
export default IntRecipeDetails