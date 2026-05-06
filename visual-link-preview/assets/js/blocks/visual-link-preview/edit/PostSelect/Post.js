const { __ } = wp.i18n;
const { Button } = wp.components;

function Post( props ) {
	const { post } = props;

	return (
		<tr
			className="vlp-post-select-row"
		>
			<td className="vlp-post-select-col-thumbnail">
				{ post.thumbnail ? (
					<img src={ post.thumbnail } alt="" />
				) : (
					<span className="vlp-post-select-thumbnail-placeholder" aria-hidden="true" />
				) }
			</td>
			<td className="vlp-post-select-col-type">{ post.post_type }</td>
			<td className="vlp-post-select-col-date">{ post.date_display }</td>
			<td className="vlp-post-select-col-title"><a href={ post.permalink } target="_blank">{ post.title }</a></td>
			<td className="vlp-post-select-col-action">
				<Button
					className="vlp-post-select-use"
					variant="primary"
					onClick={ () => {
						props.selectPost( post );
					} }
				>{ __( 'Use this post' ) }</Button>
			</td>
		</tr>
) };

export default Post;