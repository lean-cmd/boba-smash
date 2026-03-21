import AppKit
import Foundation

struct SpriteJob {
  let input: String
  let output: String
}

let jobs = [
  SpriteJob(input: "src/assets/reference-crops/mochi-scene.jpg", output: "src/assets/reference-crops/mochi-scene-transparent.png"),
  SpriteJob(input: "src/assets/reference-crops/boba-scene.jpg", output: "src/assets/reference-crops/boba-scene-transparent.png"),
  SpriteJob(input: "src/assets/reference-crops/pixel-scene.jpg", output: "src/assets/reference-crops/pixel-scene-transparent.png"),
  SpriteJob(input: "src/assets/reference-crops/mango-scene.jpg", output: "src/assets/reference-crops/mango-scene-transparent.png"),
  SpriteJob(input: "src/assets/reference-crops/chino-scene.jpg", output: "src/assets/reference-crops/chino-scene-transparent.png"),
  SpriteJob(input: "src/assets/reference-crops/star-scene.jpg", output: "src/assets/reference-crops/star-scene-transparent.png"),
  SpriteJob(input: "src/assets/reference-crops/bob-scene.jpg", output: "src/assets/reference-crops/bob-scene-transparent.png"),
]

let outputCanvasSize = 188
let cleanupLeft = 22
let cleanupTop = 26

let fileManager = FileManager.default
let cwd = URL(fileURLWithPath: fileManager.currentDirectoryPath)

func rgbaContext(width: Int, height: Int) -> CGContext? {
  CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: width * 4,
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  )
}

func pixelOffset(x: Int, y: Int, width: Int) -> Int {
  ((y * width) + x) * 4
}

func isSeedPixel(_ r: UInt8, _ g: UInt8, _ b: UInt8, _ a: UInt8) -> Bool {
  if a == 0 { return false }
  if r < 220 || g < 205 || b < 150 { return false }
  if abs(Int(r) - Int(g)) > 32 { return false }
  if Int(r) - Int(b) > 85 { return false }
  return true
}

func colorDistance(_ r: UInt8, _ g: UInt8, _ b: UInt8, target: (Int, Int, Int)) -> Int {
  let dr = Int(r) - target.0
  let dg = Int(g) - target.1
  let db = Int(b) - target.2
  return (dr * dr) + (dg * dg) + (db * db)
}

for job in jobs {
  let inputURL = cwd.appendingPathComponent(job.input)
  let outputURL = cwd.appendingPathComponent(job.output)

  guard
    let image = NSImage(contentsOf: inputURL),
    let tiffData = image.tiffRepresentation,
    let bitmap = NSBitmapImageRep(data: tiffData),
    let cgImage = bitmap.cgImage
  else {
    fputs("failed to load \(job.input)\n", stderr)
    exit(1)
  }

  let width = cgImage.width
  let height = cgImage.height

  guard let context = rgbaContext(width: width, height: height) else {
    fputs("failed to create rgba context for \(job.input)\n", stderr)
    exit(1)
  }

  let rect = CGRect(x: 0, y: 0, width: width, height: height)
  context.draw(cgImage, in: rect)

  guard let data = context.data else {
    fputs("failed to access image data for \(job.input)\n", stderr)
    exit(1)
  }

  let bytes = data.bindMemory(to: UInt8.self, capacity: width * height * 4)
  var visited = Array(repeating: false, count: width * height)
  var queue: [(Int, Int)] = []

  func pushSeed(x: Int, y: Int) {
    guard x >= 0 && x < width && y >= 0 && y < height else { return }
    let index = (y * width) + x
    if visited[index] { return }
    let offset = pixelOffset(x: x, y: y, width: width)
    let r = bytes[offset]
    let g = bytes[offset + 1]
    let b = bytes[offset + 2]
    let a = bytes[offset + 3]
    guard isSeedPixel(r, g, b, a) else { return }
    visited[index] = true
    queue.append((x, y))
  }

  for x in 0..<width {
    pushSeed(x: x, y: 0)
    if height > 1 {
      pushSeed(x: x, y: 1)
    }
  }

  let sideLimit = max(2, Int(Double(height) * 0.68))
  if width > 2 {
    for y in 0..<sideLimit {
      pushSeed(x: 0, y: y)
      pushSeed(x: 1, y: y)
      pushSeed(x: width - 1, y: y)
      pushSeed(x: width - 2, y: y)
    }
  }

  var sampleCount = 0
  var totalR = 0
  var totalG = 0
  var totalB = 0

  for (x, y) in queue {
    let offset = pixelOffset(x: x, y: y, width: width)
    totalR += Int(bytes[offset])
    totalG += Int(bytes[offset + 1])
    totalB += Int(bytes[offset + 2])
    sampleCount += 1
  }

  let target: (Int, Int, Int)
  if sampleCount > 0 {
    target = (totalR / sampleCount, totalG / sampleCount, totalB / sampleCount)
  } else {
    target = (248, 236, 189)
  }

  var head = 0
  let limit = 58 * 58
  while head < queue.count {
    let (x, y) = queue[head]
    head += 1

    let neighbors = [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    for (nx, ny) in neighbors {
      guard nx >= 0 && nx < width && ny >= 0 && ny < height else { continue }
      let index = (ny * width) + nx
      if visited[index] { continue }

      let offset = pixelOffset(x: nx, y: ny, width: width)
      let r = bytes[offset]
      let g = bytes[offset + 1]
      let b = bytes[offset + 2]
      let a = bytes[offset + 3]

      if a == 0 { continue }
      if r < 195 || g < 180 || b < 120 { continue }
      if abs(Int(r) - Int(g)) > 40 { continue }
      if Int(r) - Int(b) > 95 { continue }
      if colorDistance(r, g, b, target: target) > limit { continue }

      visited[index] = true
      queue.append((nx, ny))
    }
  }

  for y in 0..<height {
    for x in 0..<width {
      let index = (y * width) + x
      if !visited[index] { continue }
      let offset = pixelOffset(x: x, y: y, width: width)
      bytes[offset + 3] = 0
    }
  }

  guard let outputImage = context.makeImage() else {
    fputs("failed to make output image for \(job.input)\n", stderr)
    exit(1)
  }

  let finalImage: CGImage
  if width != outputCanvasSize || height != outputCanvasSize {
    guard let paddedContext = rgbaContext(width: outputCanvasSize, height: outputCanvasSize) else {
      fputs("failed to create padded context for \(job.output)\n", stderr)
      exit(1)
    }

    let insetX = max(0, (outputCanvasSize - width) / 2)
    let insetY = max(0, (outputCanvasSize - height) / 2)
    paddedContext.draw(
      outputImage,
      in: CGRect(x: insetX, y: insetY, width: width, height: height)
    )

    guard let paddedImage = paddedContext.makeImage() else {
      fputs("failed to pad output image for \(job.output)\n", stderr)
      exit(1)
    }

    finalImage = paddedImage
  } else {
    finalImage = outputImage
  }

  guard let cleanupContext = rgbaContext(width: outputCanvasSize, height: outputCanvasSize) else {
    fputs("failed to create cleanup context for \(job.output)\n", stderr)
    exit(1)
  }

  cleanupContext.draw(finalImage, in: CGRect(x: 0, y: 0, width: outputCanvasSize, height: outputCanvasSize))
  if let cleanupData = cleanupContext.data {
    let cleanupBytes = cleanupData.bindMemory(to: UInt8.self, capacity: outputCanvasSize * outputCanvasSize * 4)
    for y in 0..<cleanupTop {
      for x in 0..<cleanupLeft {
        let offset = pixelOffset(x: x, y: y, width: outputCanvasSize)
        cleanupBytes[offset + 3] = 0
      }
    }
  }

  guard let cleanedImage = cleanupContext.makeImage() else {
    fputs("failed to make cleaned image for \(job.output)\n", stderr)
    exit(1)
  }

  let rep = NSBitmapImageRep(cgImage: cleanedImage)
  rep.size = NSSize(width: outputCanvasSize, height: outputCanvasSize)
  guard let pngData = rep.representation(using: .png, properties: [:]) else {
    fputs("failed to encode png for \(job.output)\n", stderr)
    exit(1)
  }

  try pngData.write(to: outputURL)
  print("wrote \(job.output)")
}
