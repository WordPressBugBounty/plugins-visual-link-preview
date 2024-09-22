const { __ } = wp.i18n;
const { Button } = wp.components;

function Post( props ) {
	const { post } = props;

	return (
		<tr
			className="vlp-post-select-row"
		>
			<td>{ post.post_type }</td>
			<td>{ post.date_display }</td>
			<td><a href={ post.permalink } target="_blank">{ post.title }</a></td>
			<td>
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