from mlx_lm import load, generate

model, tokenizer = load("mlx-community/NousHermes-Mixtral-8x7B-Reddit-mlx")
response = generate(model, tokenizer, prompt="hello", verbose=True)
