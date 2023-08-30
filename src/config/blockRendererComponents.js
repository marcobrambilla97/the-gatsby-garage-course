import React from "react";
import {
    BlockRenderer,
    getStyles,
    getClasses
}
    from "@webdeveducation/wp-block-tools";
import { CallToActionButton, MediaText, Cover, TickItem, CarSearch, ContactForm7 } from "../components";
import { GatsbyImage } from "gatsby-plugin-image";
import numeral from "numeral";

export const blockRendererComponents = (block) => {
    switch (block.name) {
        case 'contact-form-7/contact-form-selector': {
            return (
                <ContactForm7
                    formId={block.attributes.id}
                    formMarkup={block.attributes.formMarkup
                        .replace('novalidate="novalidate"', "")
                        .split('aria-required="true"')
                        .join('aria-required="true" required')}
                    key={block.id}
                />
            )
        }
        case 'tgg/carsearch': {
            return (
                <CarSearch
                    key={block.id}
                    style={getStyles(block)}
                    className={getClasses(block)}
                />
            )
        }
        case 'tgg/carprice': {
            return (
                <div className="flex justify-center">
                    <div className="bg-black text-white text-3xl py-5 px-8 font-heading">
                        {numeral(block.attributes.price).format("0,0")}$
                    </div>
                </div>
            )
        }
        case 'tgg/tickitem': {
            return (
                <TickItem key={block.id}>
                    <BlockRenderer blocks={block.innerBlocks} />
                </TickItem>
            )
        }
        case "core/cover": {
            return (
                <Cover
                    style={getStyles(block)}
                    className={getClasses(block)}
                    key={block.id}
                    gatsbyImage={block.attributes.gatsbyImage}
                >
                    <BlockRenderer blocks={block.innerBlocks} />
                </Cover>
            )
        }
        case "core/image": {
            return (
                <figure key={block.id} className={getClasses(block)}>
                    <GatsbyImage
                        style={getStyles(block)}
                        image={block.attributes.gatsbyImage}
                        alt={block.attributes.alt || ""}
                        width={block.attributes.width}
                        height={block.attributes.height}
                    />
                </figure>
            );
        }
        case "tgg/ctabutton": {
            const alignMap = {
                'left': "text-left",
                'center': "text-center",
                'right': "text-right"
            };
            return (
                <div key={block.id} className={alignMap[block.attributes.data.align]}>
                    <CallToActionButton
                        destination={block.attributes.data.destination}
                        label={block.attributes.data.label}
                    />
                </div>
            );
        }
        case "core/media-text": {
            return (
                <MediaText
                    key={block.id}
                    className={getClasses(block)}
                    style={getStyles(block)}
                    verticalAlignment={block.attributes.verticalAlignment}
                    gatsbyImage={block.attributes.gatsbyImage}
                    mediaPosition={block.attributes.mediaPosition}
                >
                    <BlockRenderer blocks={block.innerBlocks} />
                </MediaText>
            );
        }
        default:
            return null;
    }
}