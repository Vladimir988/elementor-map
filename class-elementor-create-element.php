<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class ElementorCreateElement {

	private static $instance = null;

	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	public function init(){
		add_action( 'elementor/widgets/widgets_registered', array( $this, 'widgets_registered' ) );
	}

	private function widget_register($widgetPath) {
		$widget_file = get_template_directory() . $widgetPath;
		$template_file = locate_template($widget_file);
		if ( !$template_file || !is_readable( $template_file ) ) {
			$template_file = get_template_directory() . $widgetPath;
		}
		if ( $template_file && is_readable( $template_file ) ) {
			require_once $template_file;
		}
	}

	public function widgets_registered() {
		if(defined('ELEMENTOR_PATH') && class_exists('Elementor\Widget_Base')){
			$this->widget_register('/elementor-ext/widgets/class-widget-custom-map.php');
			$this->widget_register('/elementor-ext/widgets/class-widget-custom-post-layout.php');
		}
	}
}
ElementorCreateElement::get_instance()->init();

add_action( 'wp_enqueue_scripts', 'custom_posts_enqueue_scripts' );
function custom_posts_enqueue_scripts() {
	//Styles
	wp_enqueue_style( 'owl-carousel-min-css', CHILD_URL.'/elementor-ext/widgets/css/owl.carousel.min.css' );
	wp_enqueue_style( 'custom-posts-layout-css', CHILD_URL.'/elementor-ext/widgets/css/custom-posts-layout.css' );

	//Scripts
	wp_enqueue_script('owl-carousel-min-js', CHILD_URL.'/elementor-ext/widgets/js/owl.carousel.min.js', array('jquery'));
	wp_enqueue_script('custom-posts-layout-js', CHILD_URL.'/elementor-ext/widgets/js/scripts.js', array('jquery'));

	wp_register_script('tt-google-maps', add_query_arg( array( 'key' => _get_google_api_key() ), 'https://maps.googleapis.com/maps/api/js' ), false, false, true);
	wp_enqueue_script('tt-google-maps');
}

add_action( 'admin_menu', 'register_page', 99 );
add_action( 'admin_init', 'mfp_google_api_setting' );
function register_page() {
	add_submenu_page(	'elementor', esc_html__( 'Google maps API key', 'tt-elements' ),	esc_html__( 'Google maps API key', 'tt-elements' ), 'manage_options', 'tt-elements-settings', 'render_page' );
}
function render_page() {
	?>
		<div class="wrap">
			<form action="options.php" method="POST" enctype="multipart/form-data">
				<?php settings_fields('mfp_options_group'); ?>
				<?php do_settings_sections('mfp_upload_plugin_page'); ?>
				<?php submit_button('Save'); ?>
			</form>
		</div>
	<?php
}
function mfp_google_api_setting() {
	register_setting('mfp_options_group', 'mfp_options_theme', 'mfp_options_sanitize');
	add_settings_section('mfp_options_section', esc_html__( 'TT Elements Options:', 'tt-elements' ), '', 'mfp_upload_plugin_page');
	add_settings_field('mfp_body_bg_id', 'Google maps API key:', 'mfp_body_bg_callback', 'mfp_upload_plugin_page', 'mfp_options_section', array('label_for' => 'mfp_body_bg_id'));
}
function mfp_body_bg_callback() {
	$options = get_option('mfp_options_theme');
	?>
		<input type="text" name="mfp_options_theme[api_key]" id="mfp_body_bg_id" value="<?php echo esc_attr($options['api_key']); ?>" class="regular-text">
	<?php
}
function _get_google_api_key() {
	$options = get_option('mfp_options_theme');
	return $options['api_key'];
}