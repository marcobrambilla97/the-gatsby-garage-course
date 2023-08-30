import React from "react";
import { useQuery, gql } from "@apollo/client";
import numeral from "numeral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { CallToActionButton } from "../CallToActionButton";
import { PageNumber } from "./PageNumber/PageNumber";
import { navigate } from "gatsby";

// CarSearch component definition
export const CarSearch = ({ style, className }) => {
    const pageSize = 3;
    let page = 1;
    let defaultMaxPrice = "";
    let defaultMinPrice = "";
    let defaultColor = "";

    // Check if the code is running in a browser environment
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        // Parse query parameters from URL
        page = parseInt(params.get("page") || "1");
        defaultMaxPrice = params.get("maxPrice");
        defaultMinPrice = params.get("minPrice");
        defaultColor = params.get("color");
    }

    // Build metaQuery based on provided filters
    let metaQuery = "{}";
    if (defaultColor || defaultMaxPrice || defaultMinPrice) {
        let colorQuery = "";
        let minPriceQuery = "";
        let maxPriceQuery = "";

        if (defaultColor) {
            colorQuery = `{key: "color", compare: EQUAL_TO, value: "${defaultColor}"},`;
        }

        if (defaultMinPrice) {
            minPriceQuery = `{key: "price", compare: GREATER_THAN_OR_EQUAL_TO, type: NUMERIC, value: "${defaultMinPrice}"},`;
        }

        if (defaultMaxPrice) {
            maxPriceQuery = `{key: "price", compare: LESS_THAN_OR_EQUAL_TO, type: NUMERIC, value: "${defaultMaxPrice}"},`;
        }

        // Construct the final metaQuery string
        metaQuery = `{
          relation: AND
          metaArray: [${colorQuery}${minPriceQuery}${maxPriceQuery}]
        }`;
    }

    // Fetch car data using Apollo useQuery hook
    const { data, loading, error } = useQuery(gql`
        query CarsQuery($size: Int!, $offset: Int!) {
            cars(where: { metaQuery: ${metaQuery}, offsetPagination: {size: $size, offset: $offset}}) {
                nodes {
                    databaseId
                    title
                    uri
                    featuredImage {
                        node {
                            sourceUrl(size: LARGE)
                        }
                    }
                    carDetails {
                        price
                    }
                }
                pageInfo {
                    offsetPagination {
                        total
                    }
                }
            }
        }
    `, {
        variables: {
            size: pageSize,
            offset: pageSize * (page - 1)
        }
    });

    const totalResults = data?.cars?.pageInfo?.offsetPagination?.total || 0;
    const totalPages = Math.ceil(totalResults / pageSize);
    console.log(data, loading, error);

    // Handle form submission with filters
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const params = new URLSearchParams(formData);
        params.set("page", "1");
        // Navigate to the updated URL with filters
        navigate(`${window.location.pathname}?${params.toString()}`)
    }

    // Return the JSX template
    return (
        <div style={style} className={className}>
            {/* Form to filter cars */}
            <fieldset>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_110px] gap-4 bg-stone-200 p-4 mb-4">
                    {/* Min price input */}
                    <div>
                        <strong>Min price</strong>
                        <input type="number" name="minPrice" defaultValue={defaultMinPrice} />
                    </div>
                    {/* Max price input */}
                    <div>
                        <strong>Max price</strong>
                        <input type="number" name="maxPrice" defaultValue={defaultMaxPrice} />
                    </div>
                    {/* Color selection */}
                    <div>
                        <strong>Color</strong>
                        <select name="color" defaultValue={defaultColor}>
                            <option value="">Any color</option>
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="green">Green</option>
                        </select>
                    </div>
                    {/* Submit button */}
                    <div className="flex">
                        <button type="submit" className="btn mt-auto mb-[2px]">
                            Submit
                        </button>
                    </div>
                </form>
            </fieldset>
            {/* Display filtered car results */}
            {
                !loading && !!data?.cars?.nodes?.length &&
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {
                        data.cars.nodes.map((car) => (
                            <div
                                className="flex flex-col border border-stone-200 bg-stone-100 p-2"
                                key={car.databaseId}
                            >
                                {/* Display car image */}
                                {
                                    !!car.featuredImage.node.sourceUrl &&
                                    <img
                                        src={car.featuredImage.node.sourceUrl}
                                        alt=""
                                        className="h-[200px] w-full object-cover"
                                    />
                                }
                                {/* Car details */}
                                <div className="lg:flex justify-between my-2 gap-2 font-heading text-xl font-bold">
                                    <div className="my-2">
                                        {car.title}
                                    </div>
                                    <div className="text-right">
                                        {/* Display car price */}
                                        <div className="bg-emerald-900 inline-block whitespace-nowrap text-white p-2">
                                            <FontAwesomeIcon icon={faTag} />
                                            {numeral(car.carDetails.price).format("0,0")}$
                                        </div>
                                    </div>
                                </div>
                                {/* Call to action button */}
                                <div>
                                    <CallToActionButton
                                        label={"View more details"}
                                        destination={car.uri}
                                        fullWidth={true}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
            {/* Display pagination */}
            {
                !!totalResults &&
                <div className="flex items-center justify-center my-4 gap-2">
                    {
                        Array.from({ length: totalPages }).map((_, i) => {
                            return <PageNumber pageNumber={i + 1} key={i} />
                        })
                    }
                </div>
            }
        </div>
    )
}
