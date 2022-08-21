codegen: OAS_PATH=../read_worth_api/api_oas_v3.yaml
codegen:
	cp  $(OAS_PATH) oas.yaml
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
    -i /local/oas.yaml \
    -g typescript-axios \
    -o /local/api_client